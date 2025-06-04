import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative h-[500px] md:h-[700px] overflow-hidden bg-gradient-to-br from-lv-cream to-lv-beige">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white space-y-8 max-w-4xl px-4">
          <h1 className="text-3xl md:text-5xl lv-luxury text-primary lv-fade-in tracking-[0.2em] drop-shadow-2xl">
            LUV VELENCIA
          </h1>
          <p className="text-lg md:text-2xl lv-elegant lv-fade-in delay-200 max-w-2xl mx-auto font-mono leading-relaxed">
            Discover the art of luxury fashion with our exclusive collection
          </p>
        </div>
      </div>
    </section>
  );
}
