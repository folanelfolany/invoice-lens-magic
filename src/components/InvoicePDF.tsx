import { Button } from "@/components/ui/button";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { format } from "date-fns";

interface InvoiceItem {
  name: string;
  cost: number;
  quantity: number;
}

interface InvoicePDFProps {
  items: InvoiceItem[];
  total: number;
  discount: number;
  totalAfterDiscount: number;
  invoiceDate?: Date;
  shootDate?: Date;
  clientName: string;
  logoPath?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: 'contain',
  },
  title: {
    fontSize: 24,
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  dates: {
    fontSize: 12,
    marginBottom: 20,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    width: '100%',
  },
  tableHeader: {
    backgroundColor: '#6cd5ff',
  },
  tableCol: {
    width: '33.33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCell: {
    margin: 'auto',
    fontSize: 10,
    padding: 5,
  },
  total: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'right',
  },
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 72,
    color: 'rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    zIndex: -1,
  },
});

const InvoicePDFDocument = ({ items, total, discount, totalAfterDiscount, invoiceDate, shootDate, clientName, logoPath }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.watermark}>BETA VERSION</Text>
      <View style={styles.header}>
        {logoPath && <Image style={styles.logo} src={logoPath} />}
        <Text style={styles.title}>{clientName}'s Invoice</Text>
      </View>
      
      <View style={styles.dates}>
        <Text>Invoice Date: {invoiceDate ? format(invoiceDate, "PPP") : "Not specified"}</Text>
        <Text>Shoot Date: {shootDate ? format(shootDate, "PPP") : "Not specified"}</Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Item</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Quantity</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Amount</Text>
          </View>
        </View>

        {items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.name}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.quantity}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{(item.cost * item.quantity).toFixed(2)} EGP</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.total}>Total before discount: {total.toFixed(2)} EGP</Text>
      <Text style={styles.total}>Discount: {discount}%</Text>
      <Text style={styles.total}>Total after discount: {totalAfterDiscount.toFixed(2)} EGP</Text>
    </Page>
  </Document>
);

const InvoicePDF = (props: InvoicePDFProps) => {
  const { items } = props;
  
  if (items.length === 0) return null;

  return (
    <PDFDownloadLink
      document={<InvoicePDFDocument {...props} />}
      fileName="photography-invoice.pdf"
    >
      {({ loading }) => (
        <Button className="w-full" disabled={loading} type="button">
          {loading ? "Preparing PDF..." : "Download Invoice PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default InvoicePDF;