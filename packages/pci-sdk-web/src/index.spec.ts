import aptoPCISdk from './index';

describe('apto-pci-sdk', () => {
	it('should expose a valid public API', () => {
		expect(aptoPCISdk.hidePCIData).toBeDefined();
		expect(aptoPCISdk.init).toBeDefined();
		expect(aptoPCISdk.setStyle).toBeDefined();
		expect(aptoPCISdk.setTheme).toBeDefined();
		expect(aptoPCISdk.showPCIData).toBeDefined();
		expect(aptoPCISdk.showSetPinForm).toBeDefined();
	});
});
