"use client";
import Image from "next/image";
import { Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useState } from "react";
import Login from "./components/login";
import Register from "./components/register";

export default function Home() {
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [showModalRegister, setShowModalRegister] = useState(false);

  const feedbacks = [
    {
      name: "Chiến Nguyễn",
      role: "Người dùng",
      content:
        "Dịch vụ hỗ trợ tuyệt vời, hệ thống cảnh báo đột quỵ hoạt động chuyên nghiệp...",
    },
    {
      name: "Tư Võ",
      role: "Người dùng",
      content:
        "Tôi đã trải nghiệm hệ thống cảnh báo và phòng ngừa đột quỵ...",
    },
    {
      name: "Đức Lương",
      role: "Người dùng",
      content:
        "Đừng để nỗi sợ hãi hay sự do dự ngăn cản bạn kiểm soát sức khỏe của mình...",
    },
  ];

  return (
    <>
      <Login 
        showModalLogin={showModalLogin}
        setShowModalLogin={setShowModalLogin}
        setShowModalRegister={setShowModalRegister}
        onHide={() => setShowModalLogin(false)}
      />
      <Register 
        showModalRegister={showModalRegister}
        setShowModalRegister={setShowModalRegister}
        setShowModalLogin={setShowModalLogin}
        onHide={() => setShowModalRegister(false)}
      />

      <div className="flex flex-col lg:flex-row items-center justify-between px-6 mt-2 lg:px-52 py-10">
        <div className="lg:w-1/2 flex flex-col items-start text-left">
          <p className="text-3xl lg:text-4xl !font-bold">
            Hãy để công nghệ đồng hành cùng bạn trên hành trình bảo vệ sức khỏe tim mạch
          </p>
          <p className="text-gray-600 text-sm lg:text-base">
            Bảo vệ sức khỏe tim mạch của bạn mọi lúc, mọi nơi. Theo dõi chính xác nhịp tim của bạn, nhận cảnh báo sớm và đưa ra quyết định kịp thời để ngăn ngừa đột quỵ. Công nghệ thông minh giúp việc quản lý sức khỏe của bạn dễ dàng hơn bao giờ hết. Sẵn sàng bảo vệ trái tim của bạn? Bắt đầu ngay bây giờ.
          </p>
          <Button variant="none" className=" !bg-cyan-500 text-white py-2 px-4 !rounded-full">
            Tải Apps
          </Button>
        </div>

        <div className="lg:w-1/2 mt-6 lg:mt-0 flex justify-center">
          <Image 
            src="/man_doctor.png" 
            alt="Doctor" 
            width={500} 
            height={750} 
            className="max-w-full h-auto"
          />
        </div>
      </div>

      <div className="flex justify-center items-center py-10">
        <div className="w-11/12 max-w-7xl flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3 bg-gradient-to-b from-cyan-500 to-blue-500 p-8 rounded-xl text-white text-left">
            <p className="text-sm uppercase tracking-widest">Dịch vụ của chúng tôi</p>
            <p className="text-2xl font-bold mt-2 leading-snug">
              Chúng tôi sẽ giúp bảo vệ sức khỏe của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full lg:w-2/3">
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
              <div className="text-3xl mb-4">🧠</div>
              <p className="font-bold text-lg m-0">Phát hiện sớm đột quỵ</p>
              <p className="text-gray-600 text-sm m-0">
                Xác định các dấu hiệu cảnh báo sớm của đột quỵ dựa trên dữ liệu sức khỏe.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
              <div className="text-3xl mb-4">❤️</div>
              <p className="font-bold text-lg m-0">Định vị bệnh nhân</p>
              <p className="text-gray-600 text-sm m-0">
                Xác định và hiển thị vị trí bệnh nhân theo thời gian thực.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
              <div className="text-3xl mb-4">⚠️</div>
              <p className="font-bold text-lg m-0">Cảnh báo khẩn cấp</p>
              <p className="text-gray-600 text-sm m-0">
                Gửi thông báo ngay cho người thân khi phát hiện tình huống nguy hiểm.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:mx-auto max-w-[80%] py-10 flex flex-col space-x-24  md:flex-row items-center rounded-lg">
        <div className="w-full md:w-auto flex justify-center ml-30">
          <Image 
            src="/woman_doctor.png" 
            alt="Doctor" 
            width={500} 
            height={500} 
            className="rounded-lg w-40 md:w-70 object-contain"
          />
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0 px-6 md:px-10 text-left">
          <div className="flex items-center justify-start space-x-3">
            <span className="text-blue-500 text-2xl">👥</span>
            <p className="text-cyan-500 text-lg font-semibold uppercase m-0">
              VỀ TRANG WEB CẢNH BÁO VÀ PHÒNG NGỪA ĐỘT QUỴ CỦA CHÚNG TÔI
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2 m-0">
            Chúng tôi là một đội ngũ chuyên gia với những ý tưởng sáng tạo
          </p>
          <p className="text-gray-600 text-sm mt-2 m-0">
            Ví dụ, hãy lấy quy trình cảnh báo và phòng ngừa đột quỵ làm ví dụ. Đây là hệ thống quan trọng có trong mọi nền tảng theo dõi sức khỏe.
          </p>
        </div>
      </div>

      <section className="bg-white mx-auto max-w-[90%] md:max-w-[80%] py-8 px-4 md:px-16 flex flex-col md:flex-row-reverse items-center">
        <div className="md:w-1/2 flex justify-center relative mt-6 md:mt-0">
          <div className="relative w-40 h-40 md:w-72 md:h-72 rounded-full overflow-hidden">
            <Image 
              src="/talk.png" 
              alt="Doctor" 
              width={500} 
              height={500} 
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="absolute top-2 md:top-4 right-2 md:right-4 w-5 md:w-8 h-5 md:h-8 bg-green-200 rounded-full"></div>
          <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 w-4 md:w-6 h-4 md:h-6 bg-yellow-200 rounded-full"></div>
        </div>

        <div className="md:w-1/2 space-y-8 text-left mt-10">
          <p className="text-cyan-500 uppercase !font-bold tracking-wide">
            Về hệ thống của chúng tôi
          </p>
          <p className="text-2xl md:text-3xl font-bold my-4">
            Một số chức năng
          </p>
          <div className="space-y-6">
            {[
              {
                id: "01",
                title: "Phát hiện sớm đột quỵ",
                desc: "Phát triển hệ thống phát hiện sớm triệu chứng đột quỵ để can thiệp kịp thời.",
              },
              {
                id: "02",
                title: "Cảnh báo khẩn cấp",
                desc: "Tự động gửi cảnh báo đến người thân khi có nguy cơ đột quỵ.",
              },
              {
                id: "03",
                title: "Hỗ trợ",
                desc: "Hướng dẫn sơ cứu theo thời gian thực và hỗ trợ liên lạc khẩn cấp.",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex gap-3 md:gap-4 items-start hover:translate-x-1 transition-transform duration-200"
              >
                <span className="text-3xl md:text-5xl font-bold text-cyan-500">
                  {item.id}.
                </span>
                <div>
                  <p className="font-bold text-lg m-0">{item.title}</p>
                  <p className="text-gray-600 text-sm md:text-base m-0">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto p-4 mt-10 md:p-8 flex flex-col md:flex-row gap-20 mb-5">
        <div className="mb-8 md:w-1/3 md:pr-8">
          <p className="text-cyan-500 uppercase !font-bold">
            Những phản hồi chân thực từ khách hàng
          </p>
          <p className="text-3xl font-bold">
            Khách hàng thân thiết và hài lòng của chúng tôi
          </p>
          <p className="text-gray-600">
            Tính năng đánh giá giúp bạn thu thập phản hồi tích cực từ khách hàng
            và đối tác, đồng thời hiển thị trên trang web theo nhiều cách khác
            nhau để tăng uy tín và tính chuyên nghiệp
          </p>
        </div>
        <div className="space-y-6 md:w-2/3">
          {feedbacks.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-700 m-0">{item.content}</p>
              <div className="mt-4 flex items-center">
                <div className="bg-gray-200 w-10 h-10 rounded-full"></div>
                <div className="ml-4">
                  <p className="font-semibold text-green-600 m-0">{item.name}</p>
                  <p className="text-gray-500 text-sm m-0">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[95%] lg:max-w-[90%] mb-8 relative bg-cyan-50 rounded-full shadow-md px-8 py-8 sm:px-16 sm:py-10 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
        <div>
          <h2 className="text-2xl font-semibold">
            <span className="text-cyan-500 font-bold">Sẵn sàng chưa?</span> Hãy sử dụng sản phẩm của chúng tôi!
          </h2>
          <p className="text-gray-500 mt-2">
            Chúng tôi ở đây để giúp bạn phát hiện và ngăn ngừa bệnh tật.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="!rounded-full mt-4 sm:mt-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 flex items-center shadow-lg"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Liên hệ với chúng tôi ngay bây giờ
        </motion.button>
      </div>
    </>
  );
}
