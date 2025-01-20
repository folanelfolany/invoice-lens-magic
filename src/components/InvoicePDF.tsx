import { Button } from "@/components/ui/button";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

interface InvoiceItem {
  name: string;
  cost: number;
  quantity: number;
}

interface InvoicePDFProps {
  items: InvoiceItem[];
  total: number;
  invoiceDate?: Date;
  shootDate?: Date;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
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
    backgroundColor: '#f0f0f0',
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
});

const InvoicePDFDocument = ({ items, total, invoiceDate, shootDate }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Photography Invoice</Text>
      
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
              <Text style={styles.tableCell}>${(item.cost * item.quantity).toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
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
        <Button className="w-full" disabled={loading}>
          {loading ? "Preparing PDF..." : "Download Invoice PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default InvoicePDF;