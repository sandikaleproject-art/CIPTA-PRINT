// ================= DASHBOARD =================
let produk = 10;
let customer = 5;
let transaksi = 20;
let penjualan = 1500000;

document.getElementById("totalProduk").innerText = produk;
document.getElementById("totalCustomer").innerText = customer;
document.getElementById("totalTransaksi").innerText = transaksi;
document.getElementById("totalPenjualan").innerText =
    "Rp " + penjualan.toLocaleString();

// ================= DATA PRODUK =================
let dataProduk = JSON.parse(localStorage.getItem("produk")) || [];

// TAMPILKAN PRODUK
function tampilProduk() {
    let html = "";

    dataProduk.forEach((item, index) => {
        let tipeLabel = item.tipe === "meter" ? "Per Meter" : "Satuan";

        html += `
        <tr>
            <td>${item.nama}</td>
            <td>${tipeLabel}</td>
            <td>Rp ${item.harga.toLocaleString()}</td>
            <td>
                <button onclick="hapusProduk(${index})">Hapus</button>
            </td>
        </tr>`;
    });

    document.getElementById("listProduk").innerHTML = html;
}

// TAMBAH PRODUK
function tambahProduk() {
    let nama = document.getElementById("namaProduk").value;
    let harga = document.getElementById("hargaProduk").value;
    let tipe = document.getElementById("tipeProduk").value;

    if (nama === "" || harga === "") {
        alert("Isi data!");
        return;
    }

    dataProduk.push({
        nama: nama,
        harga: parseInt(harga),
        tipe: tipe
    });

    localStorage.setItem("produk", JSON.stringify(dataProduk));
    tampilProduk();
}

// HAPUS PRODUK
function hapusProduk(index) {
    dataProduk.splice(index, 1);
    localStorage.setItem("produk", JSON.stringify(dataProduk));
    tampilProduk();
}

// ================= MENU =================
function showMenu(menu, event) {

    let pages = ["dashboard", "produk", "kasir"];

    pages.forEach(p => {
        document.getElementById(p + "Page").style.display = "none";
    });

    document.getElementById(menu + "Page").style.display = "block";

    let menuItems = document.querySelectorAll(".sidebar ul li");
    menuItems.forEach(item => item.classList.remove("active"));

    event.target.classList.add("active");

    if (menu === "kasir") {
        loadProdukKasir();
    }
}

// ================= KASIR =================
let keranjang = [];
let grandTotalGlobal = 0;
function loadProdukKasir() {
    let select = document.getElementById("pilihProduk");

    select.innerHTML = '<option value="">-- Pilih Produk --</option>';

    dataProduk.forEach((item, index) => {
        select.innerHTML += `<option value="${index}">${item.nama}</option>`;
    });
}

function pilihProduk() {
    let index = document.getElementById("pilihProduk").value;
    if (index === "") return;

    let produk = dataProduk[index];

    if (produk.tipe === "meter") {
        document.getElementById("inputUkuran").style.display = "block";
    } else {
        document.getElementById("inputUkuran").style.display = "none";
    }
}

function tambahKeKeranjang() {

    let index = document.getElementById("pilihProduk").value;
    let qty = parseInt(document.getElementById("qty").value) || 1;

    if (index === "") {
        alert("Pilih produk dulu!");
        return;
    }

    let produk = dataProduk[index];
    let harga = 0;

    // ================= HITUNG HARGA =================
    if (produk.tipe === "meter") {
let ukuran = `${lebar} x ${tinggi}`;
        let lebar = parseFloat(document.getElementById("lebar").value);
        let tinggi = parseFloat(document.getElementById("tinggi").value);

        if (!lebar || !tinggi) {
            alert("Isi ukuran dulu!");
            return;
        }

        let luas = (lebar * tinggi) / 10000; // cm → meter
        harga = luas * produk.harga;

    } else {
        harga = produk.harga;
    }

harga = Math.round(harga); // biar rapi
let total = harga * qty;

    // ================= CEK PRODUK SUDAH ADA =================
let existing = keranjang.find(item =>
    item.nama === produk.nama &&
    item.harga === harga
);

    if (existing) {
        existing.qty += qty;
        existing.total += total;
    } else {
keranjang.push({
    nama: produk.nama,
    ukuran: produk.tipe === "meter" ? `${lebar}x${tinggi}` : "-",
            qty: qty,
            harga: harga,
            total: total
        });
    }

    renderKeranjang();
}
function renderKeranjang() {

    let tbody = document.getElementById("keranjangList");
    tbody.innerHTML = "";

    grandTotalGlobal = 0;

    keranjang.forEach((item, i) => {

        grandTotalGlobal += item.total;

        tbody.innerHTML += `
        <tr>
    <td>${item.nama}</td>
<td>${item.ukuran}</td> <!-- TAMBAHKAN INI -->
<td>${item.qty}</td>
            <td>Rp ${Math.round(item.harga).toLocaleString()}</td>
            <td>Rp ${Math.round(item.total).toLocaleString()}</td>
            <td><button onclick="hapusItem(${i})">X</button></td>
        </tr>`;
    });

    document.getElementById("grandTotal").innerText =
        "Total: Rp " + Math.round(grandTotalGlobal).toLocaleString();
}

function hapusItem(i) {
    keranjang.splice(i, 1);
    renderKeranjang();
}

// ================= INIT =================
tampilProduk();
document.getElementById("uangBayar").addEventListener("input", function () {
    let bayar = this.value;
   let total = grandTotalGlobal;

    let kembali = bayar - total;

    if (kembali < 0) kembali = 0;

    document.getElementById("kembalian").innerText =
        "Kembalian: Rp " + kembali.toLocaleString();
});
function prosesBayar() {

    if (keranjang.length === 0) {
        alert("Keranjang kosong!");
        return;
    }

    let metode = document.getElementById("metodeBayar").value;
    let bayar = parseInt(document.getElementById("uangBayar").value);

    let total = grandTotalGlobal;

    if (!bayar || bayar < total) {
        alert("Uang kurang!");
        return;
    }

    let kembali = bayar - total;

    // ================= SIMPAN TRANSAKSI =================
    let dataTransaksi = JSON.parse(localStorage.getItem("transaksi")) || [];

    let transaksiBaru = {
        tanggal: new Date().toLocaleString(),
        metode: metode,
        total: total,
        bayar: bayar,
        kembali: kembali,
        items: keranjang
    };

    dataTransaksi.push(transaksiBaru);
    localStorage.setItem("transaksi", JSON.stringify(dataTransaksi));

    // ================= BUAT NOTA =================
    document.getElementById("nota").style.display = "block";

    document.getElementById("notaTanggal").innerText =
        "Tanggal: " + transaksiBaru.tanggal;

    let html = "";
    keranjang.forEach(item => {
        html += `
        <tr>
            <td>${item.nama}</td>
            <td>${item.qty}</td>
            <td>Rp ${Math.round(item.total).toLocaleString()}</td>
        </tr>`;
    });

    document.getElementById("notaItem").innerHTML = html;

    document.getElementById("notaTotal").innerText =
        "Total: Rp " + total.toLocaleString();

    document.getElementById("notaBayar").innerText =
        "Bayar: Rp " + bayar.toLocaleString();

    document.getElementById("notaKembali").innerText =
        "Kembali: Rp " + kembali.toLocaleString();

    // ================= RESET =================
    keranjang = [];
    renderKeranjang();

    document.getElementById("uangBayar").value = "";
    document.getElementById("kembalian").innerText = "Kembalian: Rp 0";
}
