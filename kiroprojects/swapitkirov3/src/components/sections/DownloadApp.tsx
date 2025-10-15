export function DownloadApp() {
  return (
    <section 
      className="relative flex flex-col items-center gap-6 lg:gap-10 px-4 md:px-6 lg:px-[165px] py-section-mobile md:py-section-tablet lg:py-20 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="flex flex-col gap-6 lg:gap-10 w-full z-10">
        {/* Section Header */}
        <div className="flex flex-col gap-1 text-center max-w-2xl mx-auto">
          <h2 className="text-h2" style={{ color: 'var(--text-primary)' }}>
            Get the SwapIt App
          </h2>
          <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
            Take SwapIt with you anywhere. Coming soon to iOS and Android.
          </p>
        </div>

        {/* App Store Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2 justify-center">
          <div className="w-full sm:w-[180px] h-[52px] bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
            <span className="text-white text-sm">Google Play</span>
          </div>
          <div className="w-full sm:w-[180px] h-[52px] bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
            <span className="text-white text-sm">App Store</span>
          </div>
        </div>
      </div>

      {/* Phone Mockup - Hidden on mobile, positioned differently on tablet/desktop */}
      <div className="hidden lg:block absolute right-0 xl:right-[623px] -bottom-[75px] w-[400px] xl:w-[790px] h-[300px] xl:h-[592px] opacity-20 lg:opacity-100">
        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 text-sm xl:text-base">Phone Mockup Placeholder</span>
        </div>
      </div>
    </section>
  )
}