import { FiLayout, FiShare2, FiDownload, FiStar } from "react-icons/fi";

const FeaturesSection = () => {
  const features = [
    {
      icon: <FiLayout />,
      title: "Custom Frames",
      description: "Create beautiful photo frames with our easy-to-use design tools and templates.",
      color: "#FFE99A",
      delay: "0.1s"
    },
    {
      icon: <FiShare2 />,
      title: "Share Creations",
      description: "Share your frame designs with friends or the SnapLove community.",
      color: "#FFD586", 
      delay: "0.2s"
    },
    {
      icon: <FiDownload />,
      title: "Download Photos",
      description: "Download your photos with frames in high quality for printing or social media.",
      color: "#FFAAAA",
      delay: "0.3s"
    },
    {
      icon: <FiStar />,
      title: "Leaderboards",
      description: "Get featured on leaderboards when your frames become popular.",
      color: "#FF9898",
      delay: "0.4s"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFE99A] rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFAAAA] rounded-full opacity-10 blur-3xl"></div>
      
      <div className="container mx-auto px-6 md:px-12 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why Choose <span className="text-[#FF9898]">SnapLove</span>?
          </h2>
          <p className="text-gray-600 text-lg">
            SnapLove offers everything you need to create beautiful photo frame experiences
            for any occasion or event.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card group hover:translate-y-[-8px] fade-in"
              style={{animationDelay: feature.delay}}
            >
              <div 
                className="w-14 h-14 flex items-center justify-center rounded-2xl mb-6 text-2xl transition-all duration-300 group-hover:scale-110"
                style={{backgroundColor: `${feature.color}30`, color: feature.color}}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;