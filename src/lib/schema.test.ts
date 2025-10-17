// Test validazione con data invalida
console.log("\nTest validazione con data invalida:");
try {
  EventFormSchema.parse({
    title: "x", // Troppo corto
    endDate: new Date("2025-10-24"), // Prima di inizio
  });
  console.log("❌ Dovrebbe fallire");
} catch (error) {
  console.log("✅ Corretto catturato errore:", error.message);
  console.log(
    "✅ Corretto catturato errore:",
    error.issues?.map((i) => `${i.path}: ${i.message}`)
  );
}
