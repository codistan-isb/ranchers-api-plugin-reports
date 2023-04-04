import ObjectID from "mongodb";
export default {
    Mutation: {
        createReport: async (parent, args, context, info) => {
            const report = {
                posOrderId: args.posOrderId,
                riderName: args.riderName,
                cityName: args.cityName,
                branchName: args.branchName,
                orderReportStatus: args.orderReportStatus,
                orderDeliveryTime: args.orderDeliveryTime,
            };
            const { Reports } = context.collections;
            const result = await Reports.insertOne(report);
            console.log(result)
            return result.ops[0];
        },
        updateReport: async (parent, args, context, info) => {
            console.log(args)
            console.log(context)
            const { Reports } = context.collections;
            const { posOrderId } = args;
            const LoginUserID = context.user.id;
            const existingReport = await Reports.findOne({ posOrderId });
            console.log(existingReport)
            console.log(LoginUserID)
            if (!existingReport) {
                throw new Error(`Report with posOrderId ${posOrderId} not found`);
            }
            // if (existingReport.userId !== LoginUserID) {
            //     throw new Error(`You are not authorized to update this report`);
            // }
            const updatedReport = { ...existingReport, ...args };
            const updationResponse = await Reports.updateOne({ posOrderId }, { $set: updatedReport });
            console.log(updationResponse)
            return updatedReport;
        }
    },
    Query: {
        getAllReports: async (parent, args, context, info) => {
            const { Reports } = context.collections;
            const result = await Reports.find().toArray();
            console.log(result)
            return result;
        },
        getReports: async (parent, args, context, info) => {
            const { Reports } = context.collections;
            // const { posOrderId } = args;
            // console.log(context)
            // console.log(context.user)
            // const LoginUserID = context.user.id

            const result = await Reports.find({ ...args }).toArray();
            // const result = await Reports.find({ posOrderId, LoginUserID }).toArray();
            console.log(result)
            const allOrders = result.map(order => ({
                id: order._id,
                ...order
            }));
            return allOrders
        },
    },
}