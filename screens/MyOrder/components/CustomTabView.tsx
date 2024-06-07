import React from 'react';
import {View, Text, StyleSheet, Pressable, FlatList} from 'react-native';
import {Tab} from "./type";

type Props = {
    tabs: Tab[];
    renderScene: (tab: Tab) => React.ReactNode;
}

const CustomTabView = (props: Props) => {
    const {tabs, renderScene} = props;
    const [selectedTab, setSelectedTab] = React.useState<number>(0);
    const renderItem = ({item, index}: { item: Tab, index: number }) => (
        <Pressable
            style={[
                styles.tabItem,
                index === selectedTab && styles.selectedTab,
                index !== 0 && styles.notFirstTab
            ]}
           onPress={() => setSelectedTab(index)}
        >
            <Text style={styles.titleStyle}>{item.title}</Text>
        </Pressable>
    )
    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <View style={styles.label}>
                <FlatList
                    data={tabs}
                    renderItem={renderItem}
                    horizontal
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}/>
                </View>
            </View>
            <View style={styles.contentLabel}>
                {renderScene(tabs[selectedTab])}
            </View>
        </View>
    );
};

export default CustomTabView;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
    },
    labelContainer: {
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15
    },
    label: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    contentLabel: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15
    },
    tabItem: {
        paddingVertical: 16,
    },
    selectedTab: {
        borderBottomWidth: 1,
        borderBottomColor: '#0158d6'
    },
    notFirstTab: {
        marginLeft: 12
    },
    titleStyle: {
        fontSize: 16,
        fontWeight: '500'
    }
})