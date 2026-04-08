import { headers } from "next/headers";

const IP_HEADER_PROPERTIES = [
    "cf-connecting-ip",
    "x-client-ip",
    "x-forwarded-for",
    "x-real-ip",
    "x-cluster-client-ip",
    "forwarded-for",
    "forwarded",
]

export async function getIPAddress(){
    const headersList = headers();
    try {
        for(const header of IP_HEADER_PROPERTIES){
            let value: string | null | undefined;
            if (headersList && typeof (headersList as any).get === "function") {
                value = (headersList as any).get(header);
            } else if (headersList && typeof headersList === "object") {
                value = (headersList as any)[header] || (headersList as any)[header.toLowerCase()] || (headersList as any)[header.toUpperCase()];
            }
            if(typeof value === "string"){
                const ip = value.split(",")[0].trim();
                if(ip) return ip;
            }
        }
    } catch (err) {
        console.error("getIPAddress: error reading headers:", err, headersList);
    }

    return "0.0.0.0";
}