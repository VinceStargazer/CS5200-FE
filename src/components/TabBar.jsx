export default function TabBar({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex gap-4 border-b border-slate-300 mb-2">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          onClick={() => setActiveTab(index)}
          className={`px-4 pb-2 text-sm font-medium transition ${
            activeTab === index
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
