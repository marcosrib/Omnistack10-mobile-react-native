import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/main'
import Profile from './pages/profile';

const Routes = createAppContainer(
    createStackNavigator({
        Main: {
            screen: Main,
            navigationOptions: {
                title: 'DevRadar'
            }
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                title: 'Profile do Git'
            },
        },

    },
        {
            defaultNavigationOptions: {
                headerTintColor:'#fff',
                headerStyle: {
                    backgroundColor: '#7d48e7'
                }
            },
        },
    )
);

export default Routes;