import React from "react";
import bgImg from "../assets/bg.png";

export default function Weather() {
  return (
    <div
      className="w-screen min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="flex flex-col sm:flex-row gap-4 bg-gray-500/50 p-4 rounded-lg w-full max-w-4xl shadow-lg shadow-black/30">  {/*main div */}

          <div className="bg-white/40 p-4 rounded-lg w-full sm:w-40 h-40 sm:h-50 shadow-lg shadow-black/30 mt-30">
          <h1>search</h1>
          </div>  {/*search div */}
          <div className="bg-white/30 p-4 rounded-lg w-full sm:flex-1 h-100 sm:h-104 flex items-top justify-start shadow-lg shadow-black/30 gap-3">{/*inside container */}
                <div className="bg-white/40 p-4 rounded-lg w-full sm:w-40 h-40 sm:h-96 shadow-lg shadow-black/30">
                <h1>you are in limpopo, gwa fisha pleke faa</h1>
                </div>
                <div>
                    <div className="bg-white/40 p-4 rounded-lg w-full sm:w-121 h-40 sm:h-30 shadow-lg shadow-black/30">
                    <h1>here ill try to add something nice</h1>
                    </div> {/*pressure/humility */}
                    
                    <div className="flex gap-3"> {/*hour divs */}
                    <div className="bg-white/40 p-4 rounded-lg w-full sm:w-28 h-40 sm:h-30 shadow-lg shadow-black/30 mt-3">
                    <h1>first hour</h1>
                    </div>
                    <div className="bg-white/40 p-4 rounded-lg w-full sm:w-28 h-40 sm:h-30 shadow-lg shadow-black/30 mt-3">
                    <h1>second hour</h1>
                    </div>
                    <div className="bg-white/40 p-4 rounded-lg w-full sm:w-28 h-40 sm:h-30 shadow-lg shadow-black/30 mt-3">
                    <h1>third hour</h1>
                    </div>
                    <div className="bg-white/40 p-4 rounded-lg w-full sm:w-28 h-40 sm:h-30 shadow-lg shadow-black/30 mt-3">
                    <h1>fifth hour</h1>
                    </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-white/40 p-4 rounded-lg w-full sm:w-28 h-40 sm:h-30 shadow-lg shadow-black/30 mt-3">
                        <h1>day</h1>
                        </div>
                        <div className="bg-white/40 p-4 rounded-lg w-full sm:w-28 h-40 sm:h-30 shadow-lg shadow-black/30 mt-3">
                        <h1>day</h1>
                        </div>
                        <div className="bg-white/40 p-4 rounded-lg w-full sm:w-28 h-40 sm:h-30 shadow-lg shadow-black/30 mt-3">
                        <h1>day</h1>
                        </div>
                        <div className="bg-white/40 p-4 rounded-lg w-full sm:w-28 h-40 sm:h-30 shadow-lg shadow-black/30 mt-3">
                        <h1>day</h1>
                        </div>
                    </div>
                </div>  
                
          </div>
          
        </div>
      </div>
    </div>
  );
}
