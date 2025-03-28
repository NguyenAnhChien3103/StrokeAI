"use client";
import Image from "next/image";

export default function FirstAidInstruction() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
        <Image
          src="/so_cuu.png"
          alt="StrokeAI Help"
          fill
          style={{ objectFit: "cover" }}
          priority
          className="object-center"
        />
      </div>

      <div className="mt-5 mb-10">
        <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
          Đột quỵ là tình trạng nguy hiểm xảy ra khi lưu lượng máu đến não bị gián đoạn, gây tổn thương tế bào não và ảnh hưởng nghiêm trọng đến sức khỏe. Nếu không được cấp cứu kịp thời, đột quỵ có thể dẫn đến tàn tật vĩnh viễn hoặc tử vong. Việc nhận diện sớm các dấu hiệu đột quỵ, thực hiện sơ cứu đúng cách và đưa người bệnh đến cơ sở y tế nhanh chóng là yếu tố quan trọng giúp giảm thiểu rủi ro và tăng cơ hội phục hồi.
        </p>
        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          Phương Pháp Đột Quỵ Cần Nắm Vững : 
        </div>
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <div className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Bước 1: Giữ bình tĩnh và đặt người bệnh nằm nghiêng
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Giữ người bệnh nằm nghiêng để tránh nguy cơ hít phải dị vật hoặc dịch tiết vào đường thở nếu người bệnh nôn mửa. Tư thế nằm nghiêng cũng giúp giảm áp lực lên đồng thời làm thông thoáng đường thở bằng cách lau sạch đờm dãi nếu có.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <div className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Bước 2: Gọi cấp cứu
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Đây là bước quan trọng nhất trong đột quỵ tại nhà. Gọi cấp cứu ngay lập tức để đưa người bệnh đến cơ sở y tế gần nhất. Hãy báo cho nhân viên y tế biết các triệu chứng người bệnh đang gặp phải để họ có thể chuẩn bị sẵn sàng.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <div className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Bước 3: Không để người bệnh cử động mạnh
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Không nên di chuyển người bệnh quá nhiều, và đặc biệt không nên để họ tự mình đi lại. Động tác mạnh có thể khiến máu lưu thông nhanh hơn, làm tăng áp lực lên não và khiến tình trạng tồi tệ hơn.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <div className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Bước 4: Hỗ trợ hô hấp nhân tạo khi hôn mê, ngừng thở
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Kiểm tra tim mạch, huyết áp, nhịp thở: 
              <br></br>
              - Huyết áp: Nếu bạn có máy đo huyết áp tại nhà, hãy kiểm tra huyết áp của người bệnh. Tuy nhiên, không tự ý dùng thuốc hạ huyết áp nếu không có chỉ định từ bác sĩ.
              <br></br>
              - Nhịp thở: Hãy theo dõi nhịp thở của bệnh nhân và đảm bảo họ thở được dễ dàng.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <div className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Bước 5: Giữ người bệnh ở trạng thái ấm áp
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Giữ thân nhiệt ổn định bằng cách đắp chăn mỏng. Lưu ý không nên sử dụng quá nhiều chăn hoặc đắp chăn dày vì có thể gây cản trở hô hấp.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <div className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Bước 6: Không tự ý dùng thuốc
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Một số người nghĩ rằng việc sử dụng thuốc aspirin có thể làm tan cục máu đông, nhưng điều này chỉ đúng với đột quỵ do tắc mạch, và không có tác dụng với đột quỵ do xuất huyết. Nên hỏi bác sĩ trước khi sử dụng. 
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
        <Image
          src="/kham_suc_khoe.png"
          alt="StrokeAI Help"
          fill
          style={{ objectFit: "cover" }}
          className="object-center"
        />
      </div>

      <div className="mb-8 mt-20">
        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          Videos: Kỹ năng sơ cứu người bệnh đột quỵ
        </div>
        <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
          <iframe 
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/SKs8EKh_3SQ" 
            title="Kỹ năng sơ cứu người bệnh đột quỵ"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />
        </div>
      </div>

      <div className="mb-8 mt-20">
        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Cách phòng chống nguy cơ đột quỵ:
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
              <p className="text-sm sm:text-base text-gray-700">Duy trì chế độ ăn lành mạnh: Bổ sung rau xanh, trái cây, hạn chế thực phẩm không tốt cho sức khỏe.</p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
              <p className="text-sm sm:text-base text-gray-700">Vận động hàng ngày: Những bài tập thể dục phù hợp mỗi ngày giúp tăng cường sức khỏe tim mạch.</p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
              <p className="text-sm sm:text-base text-gray-700">Theo dõi tình trạng huyết áp: Kiểm tra thường xuyên để đảm bảo huyết áp luôn ở mức an toàn.</p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
              <p className="text-sm sm:text-base text-gray-700">Tự bỏ thói quen hút thuốc: Thuốc lá tăng nguy cơ đột quỵ.</p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
              <p className="text-sm sm:text-base text-gray-700">Luôn để đầu óc thoải mái: Stress làm tăng huyết áp, gây áp lực lên tim và mạch máu.</p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
              <p className="text-sm sm:text-base text-gray-700">Ngoài ra, nếu bạn hoặc người thân có dấu hiệu đau đầu, tiểu đường, hoặc tiền sử đột quỵ, hãy thường xuyên khám sức khỏe theo chỉ dẫn của bác sĩ.</p>
            </div>
          </div>

          <div className="flex-1">
            <div className="p-4 sm:p-6 bg-blue-50 rounded-lg h-full flex items-center">
              <p className="text-sm sm:text-base text-gray-700 italic">
                Tuy nhiên, việc duy trì lối sống lành mạnh và tuân thủ các biện pháp phòng ngừa đóng vai trò quan trọng trong việc bảo vệ sức khỏe, đặc biệt là phòng tránh đột quỵ. Bằng cách áp dụng chế độ ăn uống hợp lý, rèn luyện thể chất, theo dõi huyết áp, từ bỏ thuốc lá và kiểm soát căng thẳng, mỗi người có thể giảm thiểu nguy cơ mắc bệnh. Đối với những ai có tiền sử bệnh lý, việc thăm khám định kỳ theo hướng dẫn của bác sĩ là điều cần thiết để kịp thời phát hiện và xử lý các vấn đề sức khỏe, giúp duy trì cuộc sống an toàn và chất lượng hơn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Khi Nào Nên Gọi Cấp Cứu Section */}
      <div className="mb-8 mt-20">
        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Khi Nào Nên Gọi Cấp Cứu Ngay
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-6">
            <p className="text-sm sm:text-base text-gray-700">
              Gọi cấp cứu kịp thời có thể quyết định sự sống còn trong trường hợp đột quỵ. Khi nhận thấy các dấu hiệu bất thường như méo miệng, yếu liệt tay chân, nói khó hoặc bất tỉnh, cần ngay lập tức gọi cấp cứu để đảm bảo người bệnh được can thiệp y tế nhanh chóng. Mỗi giây trôi qua đều quan trọng – càng chậm trễ, nguy cơ tổn thương não càng cao.
            </p>

            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Nếu Thấy Một Trong Số Các Triệu Chứng Dưới Đây, Hãy Gọi 115 Ngay:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base text-gray-700">Đột ngột đau đầu dữ dội mà chưa từng gặp trước đây.</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base text-gray-700">Mất thăng bằng nghiêm trọng và không thể đi lại bình thường.</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base text-gray-700">Cảm giác tê liệt mặt thị lực một hoặc hai bên mắt.</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base text-gray-700">Khó khăn trong việc nói chuyện hoặc không hiểu người khác nói gì.</p>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 sm:p-6 rounded-lg">
              <p className="text-sm sm:text-base text-gray-700 font-semibold">
                ⚠️ Thời Gian Là Yếu Tố Quan Trọng Nhất Để Xử Lý Đột Quỵ. Nếu Có Thể Sơ Cứu Và Đưa Người Bệnh Đến Bệnh Viện Trong Vòng &ldquo;Giờ Vàng&rdquo; (3-4 Giờ Sau Khi Xuất Hiện Triệu Chứng), Khả Năng Hồi Phục Sẽ Cao Hơn Rất Nhiều.
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="relative w-full h-[200px] sm:h-[250px] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&q=80"
                alt="Khám bệnh tại phòng khám"
                fill
                style={{ objectFit: "cover" }}
                className="object-center"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative w-full h-[140px] sm:h-[180px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80"
                  alt="Chăm sóc bệnh nhân 1"
                  fill
                  style={{ objectFit: "cover" }}
                  className="object-center"
                />
              </div>
              <div className="relative w-full h-[140px] sm:h-[180px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80"
                  alt="Chăm sóc bệnh nhân 2"
                  fill
                  style={{ objectFit: "cover" }}
                  className="object-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative w-full h-[140px] sm:h-[180px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80"
                  alt="Chăm sóc bệnh nhân 3"
                  fill
                  style={{ objectFit: "cover" }}
                  className="object-center"
                />
              </div>
              <div className="relative w-full h-[140px] sm:h-[180px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80"
                  alt="Chăm sóc bệnh nhân 4"
                  fill
                  style={{ objectFit: "cover" }}
                  className="object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
