export const bibleVerses = [
  {
    text: "Porque yo sé los planes que tengo para ustedes —dice el Señor—. Son planes para lo bueno y no para lo malo, para darles un futuro y una esperanza.",
    reference: "Jeremías 29:11"
  },
  {
    text: "Todo lo puedo en Cristo que me fortalece.",
    reference: "Filipenses 4:13"
  },
  {
    text: "Confía en el Señor con todo tu corazón, y no te apoyes en tu propio entendimiento.",
    reference: "Proverbios 3:5"
  },
  {
    text: "El Señor es mi pastor, nada me faltará.",
    reference: "Salmos 23:1"
  },
  {
    text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree no se pierda, mas tenga vida eterna.",
    reference: "Juan 3:16"
  },
  {
    text: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien.",
    reference: "Romanos 8:28"
  },
  {
    text: "Encomienda a Jehová tu camino, y confía en él; y él hará.",
    reference: "Salmos 37:5"
  }
];

export function getDailyVerse(): { text: string; reference: string } {
  const today = new Date().getDate();
  return bibleVerses[today % bibleVerses.length];
}
