import React from "react";

function UserStats() {
  return (
    <section
      className="relative h-[400px] md:h-[500px] bg-fixed bg-cover bg-center "
      style={{
        backgroundImage:
          'url("https://plus.unsplash.com/premium_photo-1720744786849-a7412d24ffbf?q=80&w=2009&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <div className="w-full md:w-[50%] flex flex-col gap-8 md:gap-18 items-center justify-center px-4">
          <h2 className="px-4 text-2xl font-bold text-center text-white md:text-4xl md:px-15">
            Join with us And get Unlimited Access of our Blog
          </h2>
          <div className="flex flex-col md:flex-row gap-6 md:gap-20 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&>div]:text-center [&>div>h3]:text-2xl md:[&>div>h3]:text-[36px] [&>div>h3]:font-bold [&>div>h3]:text-orange-500 [&>div>p]:text-white [&>div>p]:font-semibold">
            <div>
              <h3>2,000+</h3>
              <p>Active Readers</p>
            </div>
            <div>
              <h3>100+</h3>
              <p>Unique visitor</p>
            </div>
            <div>
              <h3>100000+</h3>
              <p>Views</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserStats;
