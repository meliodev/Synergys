import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, FlatList } from 'react-native'

import Appbar from '../../components/Appbar'
import NewsItem from '../../components/NewsItem'

import { constants } from '../../core/constants'

export default class ListNews extends Component {
    constructor(props) {
        super(props)
        this.renderPost = this.renderPost.bind(this)

        this.state = {
            news: [],
            loading: false,
        }
    }

    fetchWordpressPosts = async () => {
        const response = await fetch("https://groupe-synergys.fr/wp-json/wp/v2/posts?_embed")
        const json = await response.json()
        this.setState({ news: json, loading: false }, () => console.log(this.state.news))
    }

    renderPost(post) {
        const regex = /(<([^>]+)>)/ig;

        let newspost = {
            postId: post.id,
            postDate: post.date,
            postLink: post.guid.rendered,
            postTitle: post.title.rendered,
            postExcerpt: post.excerpt.rendered,
            postContent: post.content.rendered,
            postCategory: post.categories,
            postImageUri: post._embedded['wp:featuredmedia'][0].link
        }
        return (
            <NewsItem
                title={post.title.rendered.replace(regex, '')}
                uri={post._embedded['wp:featuredmedia'][0].link}
                //overview= ''
                onPress={() => this.viewNews(newspost)}
                style={{ margin: 10 }} />

            // <Row style={{ height: 80 }}>
            //     <View styleName="vertical stretch space-between">
            //         <Subtitle
            //             numberOfLines={2}
            //             newspost={newspost}
            //             onPress={() => this.viewNews(newspost)}>
            //             {post.title.rendered.replace(regex, '').toUpperCase()}
            //         </Subtitle>
            //     </View>
            // </Row>
        )
    }

    componentDidMount() {
        this.fetchWordpressPosts()
    }

    viewNews(newspost) {
        this.props.navigation.navigate('ViewNews', { newspost: newspost })
    }

    render() {
        const regex = "/(<([^>]+)>)/ig"
        const { news } = this.state
        return (
            <SafeAreaView style={styles.safeArea}>
                <Appbar menu title titleText='Actualités' />
                <FlatList
                    data={news}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => this.renderPost(item)}
                    contentContainerStyle={{ paddingTop: 10 }} />
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#fff'
    },
})

