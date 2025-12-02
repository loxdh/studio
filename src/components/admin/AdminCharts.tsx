'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

type Order = {
    id: string;
    total: number;
    status: string;
    createdAt: any; // Firestore Timestamp
};

type AdminChartsProps = {
    orders: Order[];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminCharts({ orders }: AdminChartsProps) {
    // 1. Prepare Data for Revenue Chart (Group by Date)
    const revenueData = orders.reduce((acc: any[], order) => {
        if (!order.createdAt) return acc;
        const date = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
        const dateStr = format(date, 'MMM dd');

        const existing = acc.find((item) => item.date === dateStr);
        if (existing) {
            existing.total += order.total;
        } else {
            acc.push({ date: dateStr, total: order.total });
        }
        return acc;
    }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Basic sort, might need year for accurate sort if spanning years

    // 2. Prepare Data for Status Distribution
    const statusData = orders.reduce((acc: any[], order) => {
        const status = order.status || 'unknown';
        const existing = acc.find((item) => item.name === status);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: status, value: 1 });
        }
        return acc;
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Revenue Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']} />
                            <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Order Status Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
