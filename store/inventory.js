import { defineStore } from 'pinia'

export const useInventoryStore = defineStore({
  id: 'inventory',
  state: () => {
    return {
      computers: [
        {
          'make': 'protectli',
          'model': 'vp2410',
          'img': 'https://protectli.com/wp-content/uploads/2021/05/VP2410_150x150transp.png',
          'base': 37900,
          'description': '4 Celeron Network Port Fanless Appliance'
        },
        {
          'make': 'protectli',
          'model': 'vp4630',
          'base': 64900,
          'img': 'https://protectli.com/wp-content/uploads/2022/05/VP4630_NIC2-scaled-1-600x396.jpg',
          'description': '6 Intel i3 I225V 2.5G Network Port Fanless Appliance'
        },
        {
          'make': 'protectli',
          'model': 'vp4650',
          'base': 76900,
          'img': 'https://protectli.com/wp-content/uploads/2022/06/VP4630_front_150x150.png',
          'description': '6 Intel i5 I225V 2.5G Network Port Fanless Appliance',
        },
        {
          'make': 'protectli',
          'model': 'vp4670',
          'base': 94900,
          'img': 'https://protectli.com/wp-content/uploads/2022/06/VP4630_front_150x150.png',
          'description': '6 Intel i7 I225V 2.5G Network Port Fanless Appliance'
        },
      ],
      monitors: [
        {
          'make': 'hope',
          'model': 'his-ml23.8-fpva',
          'description:': `23.8" panel mount, multi-touch, PCAP monitor `,
          'price': 130500,
        },
        {
          'make': 'hope',
          'model': 'his-19.5-fpvb',
          'description:': `19.5" panel mount, multi-touch, PCAP monitor `,
          'price': 114500,
        }
      ],
      monitorAssembly: 15000,
      monitorCables: 2500,
      monitorDcDcPowerSupply: 40000,
      monitorMountingHardware: 2500,
      operatingSystems: [
        {
          'make': 'microsoft',
          'model': 'Windows 10',
          'price': 19900,
        },
        {
          'make': 'canonical',
          'model': 'Ubuntu 22.04 Desktop',
          'price': 0,
        },
        {
          'make': 'canonical',
          'model': 'Ubuntu 22.04 Server',
          'price': 0,
        },
      ],
      operatingSystemConfiguration: 10000
    }
  },
  actions: {
  },  
  getters: {
  },
})  