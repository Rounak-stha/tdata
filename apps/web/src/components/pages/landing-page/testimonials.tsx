import Image from "next/image";

const testimonials = [
  {
    quote: "This app has transformed the way we manage projects. The AI integration is a game-changer!",
    author: "Jane Doe",
    role: "Project Manager",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    quote: "The custom templates and automations have saved us countless hours. Highly recommended!",
    author: "John Smith",
    role: "Team Lead",
    avatar: "/placeholder.svg?height=100&width=100",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg text-gray-700 mb-4">&quot;{testimonial.quote}&quot;</p>
            <div className="flex items-center space-x-4">
              <Image src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.author} width={50} height={50} className="rounded-full" />
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
