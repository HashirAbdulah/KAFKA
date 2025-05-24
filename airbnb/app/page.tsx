import Categories from "./components/Categories";
import PropertyList from "./components/properties/PropertyList";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="max-w-[1650px] mx-auto px-6">
      <Categories />
      <div className="grid mt-5 grid-cols-1 md:grid-cols-3 gap-6">
        <Suspense fallback={<div>Loading properties...</div>}>
          <PropertyList />
        </Suspense>
      </div>
    </main>
  );
}
