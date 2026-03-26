// ... all existing code up to routes ...

// ── Routes ─────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// ── Test routes (FOR DEBUGGING) ───────────────────────────
app.post('/api/payment/create-order', (req, res) => {
  res.json({ success: true, message: 'Test route working' });
});

app.get('/api/test-payment', (req, res) => {
  res.json({ success: true, message: 'Test route works' });
});

// ── 404 handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

// ── Start server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅  AGS Tutorial server running on port ${PORT}`);
});