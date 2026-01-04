import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
    header: { marginBottom: 20, textAlign: 'center', color: '#2563EB' },
    title: { fontSize: 24, fontWeight: 'bold' },
    section: { marginVertical: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    label: { fontWeight: 'bold', color: '#555' },
    totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, borderTopWidth: 1, borderColor: '#ccc', paddingTop: 10 },
    totalText: { fontSize: 16, fontWeight: 'bold' },
    footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', fontSize: 10, color: '#aaa' }
});


export const InvoicePDF = ({ invoice }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>CLINIC CMS</Text>
                <Text>123 Health Street, Medical District</Text>
                <Text>Ph: +1 (555) 000-0000</Text>
            </View>
            <View style={styles.section}>
                <View style={styles.row}>
                    <Text>Invoice ID: {invoice.id.substring(0, 8).toUpperCase()}</Text>
                    <Text>Date: {new Date().toLocaleDateString()}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Patient Details:</Text>
                    <Text>{invoice.patientName}</Text>
                    <Text>Token #{invoice.tokenNumber}</Text>
                </View>
            </View>
            <View style={[styles.section, { borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 }]}>
                <View style={styles.row}>
                    <Text>Consultation Fee</Text>
                    <Text>${invoice.billing.consultationFee}</Text>
                </View>

                {invoice.billing.medicationCost > 0 && (
                    <View style={styles.row}>
                        <Text>Pharmacy / Medication</Text>
                        <Text>${invoice.billing.medicationCost}</Text>
                    </View>
                )}
            </View>
            <View style={styles.totalRow}>
                <Text style={styles.totalText}>Total Paid: ${invoice.billing.total}</Text>
            </View>
            <View style={styles.footer}>
                <Text>Thank you for choosing Clinic CMS. Get well soon!</Text>
            </View>
        </Page>
    </Document>
);