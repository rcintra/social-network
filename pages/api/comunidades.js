import { SiteClient } from 'datocms-client'

export default async function recebedorDeRequest(req, res) {
  if (req.method === 'POST') {
    const TOKEN = process.env.TOKEN_DATO_CMS_WRITE

    const client = new SiteClient(TOKEN)

    const registroCriado = await client.items.create({
      itemType: '967687',
      ...req.body,
    })

    res.json({
      dados: 'Informacoes da API',
      registroCriado: registroCriado,
    })

    return
  }

  res.status(404).json({
    message: 'Get nao implementado',
  })
}
