const platform = {
    isChildfund : location.hostname.includes("childfund"),
    isMedicalIntelligence: location.hostname.includes("wehagom") || location.hostname.includes("samsunghospital"),
};

export default platform;