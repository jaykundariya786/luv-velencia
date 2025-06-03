import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-20" />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white space-y-6">
          <h1 className="text-4xl md:text-6xl royal-heading tracking-[0.25em] mb-8">
            GUCCI ANCORA
          </h1>
        </div>
      </div>
    </section>
  );
}
