import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {Tab} from "./components/type";
import WaitingForConfirm from "./components/WaitingForConfirm";
import CustomTabView from "./components/CustomTabView";

const tabs: Tab[] = [
    {
        title: 'Waiting For Confirm',
        content: () => <WaitingForConfirm/>
    },
    {
        title: 'Waiting for delivery',
        content: () => (
            <View>
                <Text>{'No order waiting for delivery '}</Text>
            </View>
        )
    },
    {
        title: 'Delivering',
        content: () => (
            <View>
                <Text>{'No order delivering'}</Text>
            </View>
        )
    },
    {
        title: 'Delivered',
        content: () => (
            <View>
                <Text>{'No order delivered'}</Text>
            </View>
        )
    }
]

const renderScene = (tab: Tab) => tab.content()
const MyOrderScreen = () => {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor:'#EFF5FF', paddingHorizontal: 16}}>
            <CustomTabView tabs={tabs} renderScene={renderScene} />
        </SafeAreaView>
    );
};

export default MyOrderScreen;
const styles = StyleSheet.create({})