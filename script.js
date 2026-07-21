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
// SIMPAN DATA PRODUK
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
                <button class="edit" onclick="editProduk(${index})">Edit</button>
                <button class="hapus" onclick="hapusProduk(${index})">Hapus</button>
            </td>
        </tr>
        `;
    });

    document.getElementById("listProduk").innerHTML = html;
}
// TAMBAH PRODUK
function tambahProduk() {
    let nama = document.getElementById("namaProduk").value;
    let harga = document.getElementById("hargaProduk").value;
    let tipe = document.getElementById("tipeProduk").value;

    if (nama === "" || harga === "") {
        alert("Isi semua data!");
        return;
    }

    dataProduk.push({
        nama: nama,
        harga: parseInt(harga),
        tipe: tipe
    });

    localStorage.setItem("produk", JSON.stringify(dataProduk));

    tampilProduk();

    document.getElementById("namaProduk").value = "";
    document.getElementById("hargaProduk").value = "";
}

// HAPUS PRODUK
function hapusProduk(index) {
    dataProduk.splice(index, 1);
    localStorage.setItem("produk", JSON.stringify(dataProduk));
    tampilProduk();
}

// EDIT PRODUK
function editProduk(index) {
    let namaBaru = prompt("Edit Nama:", dataProduk[index].nama);
    let hargaBaru = prompt("Edit Harga:", dataProduk[index].harga);

    if (namaBaru && hargaBaru) {
        dataProduk[index].nama = namaBaru;
        dataProduk[index].harga = parseInt(hargaBaru);

        localStorage.setItem("produk", JSON.stringify(dataProduk));
        tampilProduk();
    }
}

// PINDAH MENU
function showMenu(menu, event) {

    // sembunyikan semua halaman
    let pages = ["dashboard", "produk", "kasir"];

    pages.forEach(p => {
        let halaman = document.getElementById(p + "Page");
        if (halaman) halaman.style.display = "none";
    });

    // tampilkan yang dipilih
    let target = document.getElementById(menu + "Page");
    if (target) target.style.display = "block";

    // ubah warna menu aktif
    let menuItems = document.querySelectorAll(".sidebar ul li");
    menuItems.forEach(item => item.classList.remove("active"));

    event.target.classList.add("active");

    // khusus kasir load produk
    if (menu === "kasir") {
        loadProdukKasir();
    }
}
// JALANKAN AWAL
tampilProduk();
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
function hitungHarga() {
    let index = document.getElementById("pilihProduk").value;

    if (index === "") {
        alert("Pilih produk dulu!");
        return;
    }

    let produk = dataProduk[index];
    let total = 0;

    if (produk.tipe === "meter") {
        let lebar = document.getElementById("lebar").value;
        let tinggi = document.getElementById("tinggi").value;

        if (lebar === "" || tinggi === "") {
            alert("Isi ukuran!");
            return;
        }

        let luas = (lebar * tinggi) / 10000;
        total = luas * produk.harga;

    } else {
        total = produk.harga;
    }

    document.getElementById("hasilHarga").innerText =
        "Total: Rp " + Math.round(total).toLocaleString();
}

function testKlik() {
    alert("Klik jalan");
}
let keranjang = [];
function tambahKeKeranjang() {
    let index = document.getElementById("pilihProduk").value;
    let qty = document.getElementById("qty").value;

    if (index === "") {
        alert("Pilih produk dulu!");
        return;
    }

    let produk = dataProduk[index];
    let harga = 0;

    if (produk.tipe === "meter") {
        let lebar = document.getElementById("lebar").value;
        let tinggi = document.getElementById("tinggi").value;

        if (lebar === "" || tinggi === "") {
            alert("Isi ukuran!");
            return;
        }

        let luas = (lebar * tinggi) / 10000;
        harga = luas * produk.harga;
    } else {
        harga = produk.harga;
    }

    let total = harga * qty;

    keranjang.push({
        nama: produk.nama,
        qty: qty,
        harga: harga,
        total: total
    });

    renderKeranjang();
}
function renderKeranjang() {
    let tbody = document.getElementById("keranjangList");
    tbody.innerHTML = "";

    let grandTotal = 0;

    keranjang.forEach((item, index) => {
        grandTotal += item.total;

        tbody.innerHTML += `
            <tr>
                <td>${item.nama}</td>
                <td>${item.qty}</td>
                <td>Rp ${Math.round(item.harga).toLocaleString()}</td>
                <td>Rp ${Math.round(item.total).toLocaleString()}</td>
                <td>
                    <button onclick="hapusItem(${index})">Hapus</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("grandTotal").innerText =
        "Total: Rp " + Math.round(grandTotal).toLocaleString();
}
function hapusItem(index) {
    keranjang.splice(index, 1);
    renderKeranjang();
}
// ================== KERANJANG ==================
let keranjang = [];

// TAMBAH KE KERANJANG
function tambahKeKeranjang() {
    let index = document.getElementById("pilihProduk").value;
    let qty = document.getElementById("qty").value;

    if (index === "") {
        alert("Pilih produk dulu!");
        return;
    }

    let produk = dataProduk[index];
    let harga = 0;

    // CEK TIPE PRODUK
    if (produk.tipe === "meter") {
        let lebar = document.getElementById("lebar").value;
        let tinggi = document.getElementById("tinggi").value;

        if (lebar === "" || tinggi === "") {
            alert("Isi ukuran dulu!");
            return;
        }

        let luas = (lebar * tinggi) / 10000;
        harga = luas * produk.harga;
    } else {
        harga = produk.harga;
    }

    let total = harga * qty;

    keranjang.push({
        nama: produk.nama,
        qty: qty,
        harga: harga,
        total: total
    });

    renderKeranjang();
}

// TAMPILKAN KERANJANG
function renderKeranjang() {
    let tbody = document.getElementById("keranjangList");
    tbody.innerHTML = "";

    let grandTotal = 0;

    keranjang.forEach((item, index) => {
        grandTotal += item.total;

        tbody.innerHTML += `
            <tr>
                <td>${item.nama}</td>
                <td>${item.qty}</td>
                <td>Rp ${Math.round(item.harga).toLocaleString()}</td>
                <td>Rp ${Math.round(item.total).toLocaleString()}</td>
                <td>
                    <button onclick="hapusItem(${index})">Hapus</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("grandTotal").innerText =
        "Total: Rp " + Math.round(grandTotal).toLocaleString();
}

// HAPUS ITEM
function hapusItem(index) {
    keranjang.splice(index, 1);
    renderKeranjang();
}
