export function DownloadApp() {
  return (
    <section
      className="relative px-4 md:px-6 lg:px-[165px] pt-4 pb-0 md:pt-6 lg:pt-8 overflow-visible min-h-[288px] lg:min-h-[336px]"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 w-full h-full">
        {/* Content Section */}
        <div className="flex flex-col gap-6 lg:gap-8 w-full lg:w-1/2 text-center lg:text-left z-10">
          {/* Section Header */}
          <div className="flex flex-col gap-4">
            <h2 className="text-h2" style={{ color: 'var(--text-primary)' }}>
              Get the SwapIt App
            </h2>
            <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
              Take SwapIt with you anywhere. Coming soon to iOS and Android.
            </p>
          </div>

          {/* App Store Buttons */}
          <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 sm:gap-4 justify-center lg:justify-start">
            <div className="w-full sm:w-[180px] h-[52px] bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
              <span className="text-white text-sm">Google Play</span>
            </div>
            <div className="w-full sm:w-[180px] h-[52px] bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
              <span className="text-white text-sm">App Store</span>
            </div>
          </div>
        </div>

        {/* Phone Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
          <div className="w-[350px] md:w-[450px] lg:w-[550px] xl:w-[600px] h-[350px] md:h-[450px] lg:h-[550px] xl:h-[600px] -mb-16 md:-mb-20 lg:-mb-22">
            <img
              src="/swapitappphone.png"
              alt="SwapIt mobile app interface showing the app's features and design"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}