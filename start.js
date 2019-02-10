const { Navigation } = require('react-native-navigation');
import { registerScreens } from './src/index.js';

function start() {
	registerScreens();
	Navigation.events().registerAppLaunchedListener(() => {
		Navigation.setDefaultOptions({
			_animations: {
				startApp: {
					y: {
						from: 1000,
						to: 0,
						duration: 500,
						interpolation: 'accelerate',
					},
					alpha: {
						from: 0,
						to: 1,
						duration: 500,
						interpolation: 'accelerate'
					}
				},
				push: {
					topBar: {
						id: 'TEST',
						alpha: {
							from: 0,
							to: 1,
							duration: 500,
							interpolation: 'accelerate'
						}
					},
					bottomTabs: {
						y: {
							from: 1000,
							to: 0,
							duration: 500,
							interpolation: 'decelerate',
						},
						alpha: {
							from: 0,
							to: 1,
							duration: 500,
							interpolation: 'decelerate'
						}
					},
					bottomTabs: {
						y: {
							from: 1000,
							to: 0,
							duration: 500,
							interpolation: 'decelerate',
						},
						alpha: {
							from: 0,
							to: 1,
							duration: 500,
							interpolation: 'decelerate'
						}
					},
					content: {
						y: {
							from: 1000,
							to: 0,
							duration: 500,
							interpolation: 'accelerate',
						},
						alpha: {
							from: 0,
							to: 1,
							duration: 500,
							interpolation: 'accelerate'
						}
					}
				},
				pop: {
					topBar: {
						id: 'TEST',
						alpha: {
							from: 1,
							to: 0,
							duration: 500,
							interpolation: 'accelerate'
						}
					},
					bottomTabs: {
						y: {
							from: 0,
							to: 100,
							duration: 500,
							interpolation: 'accelerate',
						},
						alpha: {
							from: 1,
							to: 0,
							duration: 500,
							interpolation: 'accelerate'
						}
					},
					bottomTabs: {
						y: {
							from: 0,
							to: 100,
							duration: 500,
							interpolation: 'decelerate',
						},
						alpha: {
							from: 1,
							to: 0,
							duration: 500,
							interpolation: 'decelerate'
						}
					},
					content: {
						y: {
							from: 0,
							to: 1000,
							duration: 500,
							interpolation: 'decelerate',
						},
						alpha: {
							from: 1,
							to: 0,
							duration: 500,
							interpolation: 'decelerate'
						}
					}
				}
			}
		});

		Navigation.setRoot({
			root: {
        stack: {
          options: {
            topBar: { visible: false }
          },
          children: [
            {
              component: {
                name: 'runs'
              }
            },
            {
              component: {
                name: 'home'
              }
            },
            {
              component: {
                name: 'login'
              }
            },
            {
              component: {
                name: 'splash'
              }
            }
          ]
        }
			}
		});





	});
}

module.exports = {
	start
};
