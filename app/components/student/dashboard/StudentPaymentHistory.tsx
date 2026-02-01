export default function StudentPaymentHistory() {
    const payments = [
        { category: "Tuition", date: "12/01/2026", status: "Paid" },
        { category: "Library Fee", date: "15/01/2026", status: "Paid" },
        { category: "Trip Fund", date: "20/01/2026", status: "Pending" },
    ];

    return (
        <div className="bg-[#E0E0E0] p-6 lg:p-8 min-h-[200px] flex flex-col">
            <h3 className="text-lg font-medium text-black mb-6">Payment History</h3>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-black border-b border-gray-400/20">
                            <th className="pb-4 font-normal text-sm md:text-base w-1/3">Payment History</th>
                            <th className="pb-4 font-normal text-sm md:text-base w-1/4">Pay category</th>
                            <th className="pb-4 font-normal text-sm md:text-base w-1/4">Date</th>
                            <th className="pb-4 font-normal text-sm md:text-base text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-black/80">
                        {payments.map((payment, idx) => (
                            <tr key={idx} className="border-b border-gray-400/10 last:border-0 hover:bg-black/5 transition-colors">
                                <td className="py-4 text-sm md:text-base font-medium">Payment #{1001 + idx}</td>
                                <td className="py-4 text-sm md:text-base">{payment.category}</td>
                                <td className="py-4 text-sm md:text-base">{payment.date}</td>
                                <td className={`py-4 text-sm md:text-base text-right font-medium ${payment.status === 'Paid' ? 'text-green-700' : 'text-amber-700'}`}>
                                    {payment.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
