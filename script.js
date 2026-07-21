// DATA SIMULASI (nanti ini dari database)
let produk = 10;
let customer = 5;
let transaksi = 20;
let penjualan = 1500000;

// TAMPILKAN KE DASHBOARD
document.getElementById("totalProduk").innerText = produk;
document.getElementById("totalCustomer").innerText = customer;
document.getElementById("totalTransaksi").innerText = transaksi;
document.getElementById("totalPenjualan").innerText = "Rp " + penjualan.toLocaleString();
