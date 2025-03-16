"use client";
import Image from "next/image";

export default function FirstAidInstruction() {
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="relative w-full h-[400px]">
  <Image
    src="/so_cuu.png"
    alt="StrokeAI Help"
    fill
    style={{ objectFit: "cover" }}
    priority
  />
</div>

        <div className="mt-5 mb-10">
        <p className="text-gray-700 mb-4">
          Đột quỵ là tình trạng nguy hiểm xảy ra khi lưu lượng máu đến não bị gián đoạn, gây tổn thương tế bào não và ảnh hưởng nghiêm trọng đến sức khỏe. Nếu không được cấp cứu kịp thời, đột quỵ có thể dẫn đến tàn tật vĩnh viễn hoặc tử vong. Việc nhận diện sớm các dấu hiệu đột quỵ, thực hiện sơ cứu đúng cách và đưa người bệnh đến cơ sở y tế nhanh chóng là yếu tố quan trọng giúp giảm thiểu rủi ro và tăng cơ hội phục hồi.
          </p>
          <div className="text-2xl font-bold text-gray-900 mb-4">
            Phương Pháp Đột Quỵ Cần Nắm Vững : 
          </div>
          <div className="border-l-4 border-blue-500 pl-4 mb-4">
            <div className="text-lg font-semibold text-gray-800">
              Bước 1: Giữ bình tĩnh và đặt người bệnh nằm nghiêng
            </div>
            <p className="text-gray-600">
            Giữ người bệnh nằm nghiêng để tránh nguy cơ hít phải dị vật hoặc dịch tiết vào đường thở nếu người bệnh nôn mửa. Tư thế nằm nghiêng cũng giúp giảm áp lực lên đồng thời làm thông thoáng đường thở bằng cách lau sạch đờm dãi nếu có.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 mb-4">
            <div className="text-lg font-semibold text-gray-800">
              Bước 2: Gọi cấp cứu
            </div>
            <p className="text-gray-600">
            Đây là bước quan trọng nhất trong đột quỵ tại nhà. Gọi cấp cứu ngay lập tức để đưa người bệnh đến cơ sở y tế gần nhất. Hãy báo cho nhân viên y tế biết các triệu chứng người bệnh đang gặp phải để họ có thể chuẩn bị sẵn sàng.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 mb-4">
            <div className="text-lg font-semibold text-gray-800">
              Bước 3: Không để người bệnh cử động mạnh
            </div>
            <p className="text-gray-600">
            Không nên di chuyển người bệnh quá nhiều, và đặc biệt không nên để họ tự mình đi lại. Động tác mạnh có thể khiến máu lưu thông nhanh hơn, làm tăng áp lực lên não và khiến tình trạng tồi tệ hơn.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 mb-4">
            <div className="text-lg font-semibold text-gray-800">
              Bước 4: Hỗ trợ hô hấp nhân tạo khi hôn mê, ngừng thở
            </div>
            <p className="text-gray-600">
            Kiểm tra tim mạch, huyết áp, nhịp thở: 
- Huyết áp: Nếu bạn có máy đo huyết áp tại nhà, hãy kiểm tra huyết áp của người bệnh. Tuy nhiên, không tự ý dùng thuốc hạ huyết áp nếu không có chỉ định từ bác sĩ.
- Nhịp thở: Hãy theo dõi nhịp thở của bệnh nhân và đảm bảo họ thở được dễ dàng.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 mb-4">
            <div className="text-lg font-semibold text-gray-800">
              Bước 5: Giữ người bệnh ở trạng thái ấm áp
            </div>
            <p className="text-gray-600">
            Giữ thân nhiệt ổn định bằng cách đắp chăn mỏng . Lưu ý không nên sử dụng quá nhiều chăn hoặc đắp chăn dày vì có thể gây cản trở hô  hấp .
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <div className="text-lg font-semibold text-gray-800">
              Bước 6: Không tự ý dùng thuốc
            </div>
            <p className="text-gray-600">
            Một số người nghĩ rằng việc sử dụng thuốc aspirin có thể làm tan cục máu đông, nhưng điều này chỉ đúng với đột quỵ do tắc mạch, và không có tác dụng với đột quỵ do xuất huyết. Nên hỏi bác sĩ trước khi sử dụng. 
            </p>
          </div>
        </div>
        <div>
        <div className="relative w-full h-[400px]">
       <Image
       src="/kham_suc_khoe.png"
       alt="StrokeAI Help"
       fill
       style={{ objectFit: "cover" }}
      priority
       />
     </div>
     
        </div>
     
      </div>
    </>
  );
}
