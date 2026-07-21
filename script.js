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
function showMenu(menu) {
    document.getElementById("dashboardPage").style.display = "none";
    document.getElementById("produkPage").style.display = "none";

    document.getElementById(menu + "Page").style.display = "block";
}

// JALANKAN AWAL
tampilProduk();
