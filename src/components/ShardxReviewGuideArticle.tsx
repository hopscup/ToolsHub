import source from '../data/shardxReviewArticle.json';
import type {ArticleServiceOffer} from '../lib/articleServiceTracking';
import {AntidetectOverviewGuideArticle} from './AntidetectOverviewGuideArticle';
export const ShardxReviewGuideArticle = ({offers}: {offers: ArticleServiceOffer[]}) => <AntidetectOverviewGuideArticle source={source} offers={offers}/>;
