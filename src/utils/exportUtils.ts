import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { MADRASAH_INFO } from '../data/initialData';

export function exportTableToExcel(data: Record<string, any>[], fileName: string, sheetName: string = 'Data') {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  } catch (err) {
    console.error('Failed to export Excel:', err);
  }
}

interface PDFExportOptions {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: (string | number)[][];
  fileName: string;
  orientation?: 'portrait' | 'landscape';
}

export function exportTableToPDF({
  title,
  subtitle,
  headers,
  rows,
  fileName,
  orientation = 'portrait'
}: PDFExportOptions) {
  try {
    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Madrasah Header (Kop Surat Resmi)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(16, 120, 72); // Islamic green
    doc.text('YAYASAN NURUL JADID PAITON', pageWidth / 2, 14, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(20, 20, 20);
    doc.text('MADRASAH TSANAWIYAH NURUL JADID', pageWidth / 2, 21, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    doc.text(`NSM: ${MADRASAH_INFO.nsm} | NPSN: ${MADRASAH_INFO.npsn} | Status: ${MADRASAH_INFO.statusAkreditasi}`, pageWidth / 2, 26, { align: 'center' });
    doc.text(`${MADRASAH_INFO.alamat} | Telp: ${MADRASAH_INFO.telepon}`, pageWidth / 2, 30, { align: 'center' });

    // Decorative line
    doc.setDrawColor(16, 120, 72);
    doc.setLineWidth(0.8);
    doc.line(14, 33, pageWidth - 14, 33);
    doc.setLineWidth(0.2);
    doc.line(14, 34, pageWidth - 14, 34);

    // Document Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text(title.toUpperCase(), pageWidth / 2, 42, { align: 'center' });

    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(subtitle, pageWidth / 2, 47, { align: 'center' });
    }

    // AutoTable
    autoTable(doc, {
      startY: subtitle ? 52 : 48,
      head: [headers],
      body: rows,
      theme: 'grid',
      headStyles: {
        fillColor: [16, 120, 72],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [30, 41, 59]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 14, right: 14, bottom: 35 },
      didDrawPage: () => {
        // Footer pagination
        const str = `Halaman ${doc.getNumberOfPages()}`;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(str, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
        doc.text(`Dicetak melalui eKurikulum MTs. Nurul Jadid pada: ${new Date().toLocaleDateString('id-ID')}`, 14, doc.internal.pageSize.getHeight() - 10);
      }
    });

    // Signature Block at Bottom of last page
    const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 12 : 180;
    const signY = finalY > doc.internal.pageSize.getHeight() - 50 ? 40 : finalY;
    if (finalY > doc.internal.pageSize.getHeight() - 50) {
      doc.addPage();
    }

    const signX = pageWidth - 65;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text('Paiton, Probolinggo', signX, signY);
    doc.text('Kepala MTs. Nurul Jadid,', signX, signY + 5);
    
    // Tanda tangan & cap spacer
    doc.setFont('helvetica', 'bold');
    doc.text(MADRASAH_INFO.kepalaMadrasah, signX, signY + 26);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`NIUP. ${MADRASAH_INFO.niupKepala}`, signX, signY + 30);

    doc.save(`${fileName}_${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (err) {
    console.error('Failed to export PDF:', err);
  }
}

// Export single Student ID Card / Profile Card to PDF
export function exportStudentCardPDF(student: {
  nama: string;
  kelas: string;
  program: string;
  rombel: string;
  nisn?: string;
  gender?: string;
  alamat?: string;
}) {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 54] // Standard ID card size (CR80)
    });

    // Card background
    doc.setFillColor(16, 120, 72);
    doc.rect(0, 0, 85.6, 14, 'F');

    // Header title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('KARTU PELAJAR SANTRI', 42.8, 6, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('MTs. NURUL JADID PAITON', 42.8, 10.5, { align: 'center' });

    // Gold decorative stripe
    doc.setFillColor(217, 119, 6);
    doc.rect(0, 14, 85.6, 1.5, 'F');

    // Card body background
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 15.5, 85.6, 38.5, 'F');

    // Photo Box Placeholder
    doc.setFillColor(226, 232, 240);
    doc.setDrawColor(16, 120, 72);
    doc.rect(8, 19, 20, 26, 'FD');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('FOTO', 18, 32, { align: 'center' });
    doc.text('3 x 4', 18, 36, { align: 'center' });

    // Student Data
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(student.nama.length > 24 ? student.nama.slice(0, 24) + '...' : student.nama, 32, 21);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);

    doc.text('NISN', 32, 26);
    doc.text(`: ${student.nisn || '00' + Math.floor(Math.random() * 89999999 + 10000000)}`, 44, 26);

    doc.text('Kelas', 32, 30);
    doc.text(`: Kelas ${student.kelas} - Rombel ${student.rombel}`, 44, 30);

    doc.text('Program', 32, 34);
    doc.text(`: Program ${student.program}`, 44, 34);

    doc.text('Alamat', 32, 38);
    doc.text(`: ${student.alamat || 'Pondok Pesantren Nurul Jadid'}`, 44, 38);

    doc.text('Masa Berlaku', 32, 42);
    doc.text(': 2026 - 2027', 44, 42);

    // Footer small text
    doc.setFontSize(5);
    doc.setTextColor(140);
    doc.text('Jl. KH. Zaini Mun’im Karanganyar Paiton Probolinggo', 42.8, 51.5, { align: 'center' });

    doc.save(`Kartu_Pelajar_${student.nama.replace(/\s+/g, '_')}.pdf`);
  } catch (err) {
    console.error('Failed to export ID Card:', err);
  }
}

// Export single Prestasi Certificate / Card to PDF
export function exportPrestasiCardPDF(prestasi: {
  namaLomba: string;
  tingkat: string;
  keteranganJuara: string;
  namaSiswa: string;
  tahun: string;
  cabang?: string;
}) {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Border Frame
    doc.setDrawColor(16, 120, 72);
    doc.setLineWidth(3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(1);
    doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(16, 120, 72);
    doc.text('MADRASAH TSANAWIYAH NURUL JADID PAITON', pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(26);
    doc.setTextColor(217, 119, 6);
    doc.text('PIAGAM PENGHARGAAN PRESTASI', pageWidth / 2, 45, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text('Diberikan dengan penuh bangga dan apresiasi kepada:', pageWidth / 2, 58, { align: 'center' });

    // Student name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text(prestasi.namaSiswa, pageWidth / 2, 75, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text(`Atas keberhasilannya meraih prestasi sebagai:`, pageWidth / 2, 88, { align: 'center' });

    // Juara & Tingkat
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(16, 120, 72);
    doc.text(`JUARA ${prestasi.keteranganJuara} TINGKAT ${prestasi.tingkat.toUpperCase()}`, pageWidth / 2, 100, { align: 'center' });

    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text(`Pada Ajang: ${prestasi.namaLomba}`, pageWidth / 2, 110, { align: 'center' });
    if (prestasi.cabang) {
      doc.text(`Bidang / Kategori: ${prestasi.cabang}`, pageWidth / 2, 118, { align: 'center' });
    }

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`"Berilmu, Berakhlakul Karimah, dan Membawa Nama Harum Almamater Pesantren Nurul Jadid"`, pageWidth / 2, 132, { align: 'center' });

    // Signatures
    const signY = 150;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);

    // Left sign: Waka Kesiswaan
    doc.text('Paiton, Probolinggo', 40, signY);
    doc.text('Waka Bidang Kesiswaan,', 40, signY + 6);
    doc.setFont('helvetica', 'bold');
    doc.text('MUH. UTSMAN, S.Pd', 40, signY + 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('NIUP. 41820109866', 40, signY + 35);

    // Right sign: Kepala Madrasah
    doc.setFontSize(11);
    doc.text('Paiton, Probolinggo', pageWidth - 80, signY);
    doc.text('Kepala Madrasah,', pageWidth - 80, signY + 6);
    doc.setFont('helvetica', 'bold');
    doc.text(MADRASAH_INFO.kepalaMadrasah, pageWidth - 80, signY + 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`NIUP. ${MADRASAH_INFO.niupKepala}`, pageWidth - 80, signY + 35);

    doc.save(`Piagam_Prestasi_${prestasi.namaSiswa.replace(/\s+/g, '_')}.pdf`);
  } catch (err) {
    console.error('Failed to export certificate PDF:', err);
  }
}

// Download single Information Card (Prota, Promes, ATP, SK, Kisi-kisi, Evaluasi)
export function exportInfoCardPDF(cardTitle: string, details: Record<string, string | number>) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5'
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Top banner
    doc.setFillColor(16, 120, 72);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('MTs. NURUL JADID PAITON', pageWidth / 2, 8, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('KARTU INFORMASI RESMI KURIKULUM', pageWidth / 2, 14, { align: 'center' });

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(cardTitle, 14, 30);

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 34, pageWidth - 14, 34);

    let currentY = 42;
    doc.setFontSize(9);

    Object.entries(details).forEach(([key, val]) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text(`${key}:`, 14, currentY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const splitText = doc.splitTextToSize(String(val), pageWidth - 60);
      doc.text(splitText, 55, currentY);

      currentY += Math.max(splitText.length * 5, 8);
    });

    // Signature stamp
    const signY = currentY + 10;
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Tervalidasi oleh Waka Kurikulum MTs. Nurul Jadid`, 14, signY);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, signY + 5);

    doc.save(`Kartu_Informasi_${cardTitle.replace(/\s+/g, '_')}.pdf`);
  } catch (err) {
    console.error('Failed to export info card:', err);
  }
}
