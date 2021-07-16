import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../src/lib/AluraCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'
import React from 'react'

function ProfileSidebar(props) {
  return (
    <Box>
      <img
        src={`https://github.com/${props.githubUser}.png`}
        style={{ borderRadius: '8px;' }}
      />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      <ul>
        {props.items.map((c) => {
          return (
            <li key={c.id}>
              <a href={`/users/${c.title}`} key={c.id}>
                <img src={c.image} />
                <span>{c.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  console.log(process.env.TOKEN_DATO_CMS_READ)

  const [comunidades, setComunidades] = React.useState([])
  const usuarioLogado = 'rcintra'
  const pessoasFavoritas = [
    'juunegreiros',
    'peas',
    'omariosouto',
    'felipefialho',
    'rafaballerini',
    'marcobrunodev',
  ]

  const [seguidores, setSeguidores] = React.useState([])

  React.useEffect(() => {
    fetch('https://api.github.com/users/rcintra/followers')
      .then((r) => {
        return r.json()
      })
      .then((c) => {
        setSeguidores(c)
      })

    // API GraphQL
    fetch('https://graphql.datocms.com', {
      method: 'POST',
      headers: {
        Authorization: process.env.NEXT_PUBLIC_TOKEN_DATO_CMS_READ,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `query {
          allCommunities {
            id
            title
            creatorSlug
            imageUrl
          }
        }`,
      }),
    })
      .then((r) => r.json())
      .then((c) => {
        const comunidadesDato = c.data.allCommunities
        setComunidades(comunidadesDato)
      })
  }, [])

  return (
    <>
      <AlurakutMenu githubUser={usuarioLogado} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioLogado} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que vocë deseja fazer?</h2>
            <form
              onSubmit={function handleCriaComunidade(e) {
                e.preventDefault()

                const dadosDoForm = new FormData(e.target)

                const comunidade = {
                  title: dadosDoForm.get('title'),
                  imageUrl: dadosDoForm.get('image'),
                  creatorSlug: usuarioLogado,
                }

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade),
                }).then(async (res) => {
                  const dados = await res.json()
                  const comunidade = dados.registroCriado
                  const comunidadesAtualizadas = [...comunidades, comunidade]
                  setComunidades(comunidadesAtualizadas)
                })
              }}
            >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma url para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma url para usarmos de capa"
                />
              </div>

              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBox title="Seguidores" items={seguidores} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Meus amigos ({comunidades.length})</h2>
            <ul>
              {comunidades.map((c) => {
                return (
                  <li key={c.id}>
                    <a href={`/users/${c.title}`} key={c.id}>
                      <img src={c.imageUrl} />
                      <span>{c.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Minhas comunidades ({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.map((p) => {
                return (
                  <li key={p}>
                    <a href={`/users/${p}`} key={p}>
                      <img src={`https://github.com/${p}.png`} />
                      <span>{p}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
