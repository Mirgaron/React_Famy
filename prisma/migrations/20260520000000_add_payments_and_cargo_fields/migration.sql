-- CreatePaymentModel
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "tipo" TEXT NOT NULL,
    "tarjetaCreditoId" TEXT,
    "tarjetaOrigenId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_tarjetaCreditoId_fkey" FOREIGN KEY ("tarjetaCreditoId") REFERENCES "Tarjeta" (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Payment_tarjetaOrigenId_fkey" FOREIGN KEY ("tarjetaOrigenId") REFERENCES "Tarjeta" (id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- AddPagadoToCargo
ALTER TABLE "Cargo" ADD COLUMN "pagado" BOOLEAN NOT NULL DEFAULT false;

-- AddExhibicionToCargo
ALTER TABLE "Cargo" ADD COLUMN "exhibicion" INTEGER NOT NULL DEFAULT 1;

-- AddCargoPadreIdToCargo
ALTER TABLE "Cargo" ADD COLUMN "cargoPadreId" TEXT;

-- AddSelfRelationToCargo
ALTER TABLE "Cargo" ADD CONSTRAINT "Cargo_cargoPadreId_fkey" FOREIGN KEY ("cargoPadreId") REFERENCES "Cargo" (id) ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Payment_id_key" ON "Payment"("id");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Cargo_cargoPadreId_idx" ON "Cargo"("cargoPadreId");