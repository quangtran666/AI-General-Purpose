import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import {XCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

function CancelPage() {
  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center bg-leftnav">
              <CardHeader>
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4"/>
                  <CardTitle className="text-2xl font-bold text-red-400">Thanh toán thất bại</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-gray-300 mb-4">
                      Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng thử lại hoặc liên hệ với chúng tôi nếu
                      vấn đề vẫn
                      tiếp tục xảy ra.
                  </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button variant="outline" className="w-full sm:w-auto text-white">
                      Thử lại
                  </Button>
                  <Link href="/">
                      <Button className="w-full sm:w-auto text-white">Quay về trang chủ</Button>
                  </Link>
              </CardFooter>
          </Card>
      </div>
  );
}

export default CancelPage;