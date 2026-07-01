/* ============================================================
   Braga Veículos — OCR do VIN SERIAL / chassi na NUVEM (Netlify Function)
   ============================================================
   Lê o número do adesivo GM (VIN SERIAL, 6 dígitos) ou o chassi cheio (17)
   numa foto, usando um provedor de visão na nuvem — mais preciso que o OCR
   do aparelho (Tesseract). A CHAVE do provedor fica no SERVIDOR (variável de
   ambiente do Netlify), nunca no app.

   Provedor escolhido automaticamente pela variável de ambiente presente:
     • GOOGLE_VISION_API_KEY  -> Google Cloud Vision (TEXT_DETECTION)
     • ANTHROPIC_API_KEY      -> Claude (visão)
   Sem nenhuma configurada, responde 501 e o app cai no OCR local (Tesseract).

   Configuração (Netlify → Site settings → Environment variables):
     GOOGLE_VISION_API_KEY = <sua chave da API Vision>      (recomendado; mesmo
       projeto GCP do Firebase — habilite a "Cloud Vision API" e crie a chave)
     ou ANTHROPIC_API_KEY  = <sua chave Anthropic>
   Custo: ambos são pagos por uso (Vision tem cota grátis mensal). Só é chamado
   ao tirar a foto do VIN SERIAL.

   Requisição:  POST { image: "<dataURL ou base64>" }
   Resposta:    { ok:true, text:"...", provider:"google-vision"|"anthropic" }
                { ok:false, error:"..." }
   O app roda o cruzamento (matchVin) com a leitura retornada.
   ============================================================ */
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'method-not-allowed' });
  var body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { ok: false, error: 'bad-json' }); }
  var image = (body.image || '').toString();
  var b64 = image.indexOf(',') >= 0 ? image.slice(image.indexOf(',') + 1) : image;
  if (!b64) return json(400, { ok: false, error: 'no-image' });
  try {
    if (process.env.GOOGLE_VISION_API_KEY) {
      var t1 = await googleVision(b64, process.env.GOOGLE_VISION_API_KEY);
      return json(200, { ok: true, text: t1, provider: 'google-vision' });
    }
    if (process.env.ANTHROPIC_API_KEY) {
      var t2 = await claudeVision(b64, image, process.env.ANTHROPIC_API_KEY);
      return json(200, { ok: true, text: t2, provider: 'anthropic' });
    }
    return json(501, { ok: false, error: 'no-provider-configured' });
  } catch (e) {
    return json(502, { ok: false, error: String((e && e.message) || e) });
  }
};

function json(code, obj) {
  return { statusCode: code, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) };
}

async function googleVision(b64, key) {
  var r = await fetch('https://vision.googleapis.com/v1/images:annotate?key=' + encodeURIComponent(key), {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ image: { content: b64 }, features: [{ type: 'TEXT_DETECTION' }] }] })
  });
  var j = await r.json();
  if (!r.ok) throw new Error('vision-' + r.status + '-' + ((j && j.error && j.error.message) || ''));
  var anns = j.responses && j.responses[0] && j.responses[0].textAnnotations;
  return (anns && anns[0] && anns[0].description) ? anns[0].description : '';
}

async function claudeVision(b64, dataUrl, key) {
  var media = (dataUrl.match(/^data:([^;]+);/) || [])[1] || 'image/jpeg';
  var r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-sonnet-5', max_tokens: 64,
      messages: [{
        role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: media, data: b64 } },
          { type: 'text', text: 'Leia o número do chassi (VIN, 17 caracteres) ou o VIN SERIAL (6 dígitos) do adesivo GM nesta foto. Responda APENAS com o número, sem nenhum outro texto.' }
        ]
      }]
    })
  });
  var j = await r.json();
  if (!r.ok) throw new Error('anthropic-' + r.status + '-' + ((j && j.error && j.error.message) || ''));
  var t = j.content && j.content[0] && j.content[0].text;
  return (t || '').trim();
}
