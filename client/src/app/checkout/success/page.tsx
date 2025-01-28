import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import {CheckCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

function SuccessPage() {
  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center bg-leftnav">
              <CardHeader>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4"/>
                  <CardTitle className="text-2xl font-bold text-green-400">Thanh toán thành công!</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-gray-300">Cảm ơn bạn đã mua hàng. Giao dịch của bạn đã được xử lý thành công.</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                  <Link href="/">
                      <Button className="w-full sm:w-auto text-white">Quay về trang chủ</Button>
                  </Link>
              </CardFooter>
          </Card>
      </div>
  );
}

export default SuccessPage;