const KnowYourRightsUI = ({ results }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* AI Intro */}
      {results.ai_intro && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-100 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">Legal Guidance</h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{results.ai_intro}</p>
            </div>
          </div>
        </div>
      )}

      {/* Rights Overview */}
      {results.rights_overview && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-emerald-100 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-emerald-800 mb-2">Your Rights Overview</h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{results.rights_overview}</p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Rights */}
      {Array.isArray(results.detailed_rights) && results.detailed_rights.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-amber-100 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Your Detailed Rights</h3>
          </div>
          <div className="space-y-3 sm:space-y-4 ml-11 sm:ml-14">
            {results.detailed_rights.map((right, index) => (
              <div key={index} className="bg-white rounded-lg p-3 sm:p-4 border-l-4 border-amber-400 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-1 text-sm sm:text-base leading-relaxed">{right}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applicable Laws */}
      {Array.isArray(results.applicable_laws) && results.applicable_laws.length > 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Applicable Laws</h3>
          </div>
          <div className="space-y-4 ml-11 sm:ml-14">
            {results.applicable_laws.map((law, index) => (
              <div key={index} className="bg-indigo-50 rounded-lg p-3 sm:p-4 border-l-4 border-indigo-400">
                <div className="text-gray-700">
                  {typeof law === "string" ? (
                    <p className="text-sm sm:text-base">{law}</p>
                  ) : (
                    <div>
                      <p className="font-semibold text-indigo-800 mb-2 text-sm sm:text-base">{law.Section}</p>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{law.Explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {results.law_reference_source && (
            <div className="mt-4 sm:mt-6 ml-11 sm:ml-14 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-600 italic">
                <strong>Reference:</strong> {results.law_reference_source}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowYourRightsUI;
