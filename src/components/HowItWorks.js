import Image from "next/image";
import { FiEdit, FiShare2, FiCamera } from "react-icons/fi";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FiEdit />,
      title: "Create Your Frame",
      description: "Design a custom photo frame or choose from our templates to get started quickly.",
      color: "#FFE99A",
      bgColor: "#FFE99A20",
      delay: "0.1s"
    },
    {
      icon: <FiShare2 />,
      title: "Share with Friends",
      description: "Share your frame with friends or make it public for everyone to enjoy.",
      color: "#FFAAAA",
      bgColor: "#FFAAAA20",
      delay: "0.3s"
    },
    {
      icon: <FiCamera />,
      title: "Capture Moments",
      description: "Take photos using your frame and download or share them on social media.",
      color: "#FF9898",
      bgColor: "#FF989820",
      delay: "0.5s"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#FFF8F8] to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-24 left-1/4 w-64 h-64 bg-[#FFD586] rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute -bottom-24 right-1/4 w-64 h-64 bg-[#FFAAAA] rounded-full opacity-10 blur-3xl"></div>
      
      <div className="container mx-auto px-6 md:px-12 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How <span className="text-[#FF9898]">SnapLove</span> Works
          </h2>
          <p className="text-gray-600 text-lg">
            Creating and sharing beautiful photo frames is easy with SnapLove. 
            Follow these simple steps to get started.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-6">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="w-full lg:w-1/3 flex flex-col items-center text-center fade-in"
              style={{animationDelay: step.delay}}
            >
              <div 
                className="w-20 h-20 flex items-center justify-center rounded-full mb-6 text-3xl relative"
                style={{backgroundColor: step.bgColor, color: step.color}}
              >
                {step.icon}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
                  <span className="font-bold" style={{color: step.color}}>{index + 1}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600 mb-6">{step.description}</p>
              
              {/* Decorative path connecting steps */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute h-[2px] w-24 bg-gray-200 left-[calc(33.33%_-_12px)] top-1/2 transform -translate-y-1/2" style={{left: `calc(${33.33 * (index + 1)}% - 12px)`}}></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="mt-16 text-center fade-in" style={{animationDelay: "0.6s"}}>
          <button className="btn-primary">Start Creating Now</button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;