export default function About() {
  return (
    <section id="about" className="section container">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="h2">About Julia</h2>
          <p className="mt-4 text-gray-600">
            At just 18 years old, violinist <strong>Julia-Xiaozhuo Wang</strong> is already recognized as a rising star.
            She is the youngest major prize winner at the 2024 Stuttgart International Violin Competition and recently
            earned 2nd prize at the 2025 Cooper International Violin Competition. She has also claimed top honors at the
            Grumiaux International Violin Competition (1st Prize) and the Zhuhai Mozart International Competition,
            performing with the Stuttgart Philharmonic, Armenian State Symphony Orchestra, and Salzburg Chamber Soloists.
          </p>
          <p className="mt-4 text-gray-600">
            Julia began violin at age three, and at twelve moved to Vienna to study with Dora Schwarzberg and Boris Kuschnir.
            As a scholarship recipient of the Music Academy Liechtenstein, she has received mentorship from Ana Chumachenco,
            Zakhar Bron, and Leonidas Kavakos.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img className="aspect-[4/3] w-full rounded-2xl object-cover" src="/images/p1.jpg" alt="Performance" />
          <img className="aspect-[4/3] w-full rounded-2xl object-cover" src="/images/p2.jpg" alt="Rehearsal" />
          <img className="aspect-[4/3] w-full rounded-2xl object-cover" src="/images/p3.jpg" alt="Backstage" />
          <img className="aspect-[4/3] w-full rounded-2xl object-cover" src="/images/p4.jpg" alt="Audience" />
        </div>
      </div>
    </section>
  )
}
