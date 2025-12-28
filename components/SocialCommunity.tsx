
import React, { useState } from 'react';
import { SocialPost } from '../types';

interface SocialCommunityProps {
  posts: SocialPost[];
  onLike: (id: string) => void;
  onPost: (post: SocialPost) => void;
}

const SocialCommunity: React.FC<SocialCommunityProps> = ({ posts, onLike, onPost }) => {
  const [newPostContent, setNewPostContent] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const post: SocialPost = {
      id: crypto.randomUUID(),
      author: '我',
      type: 'achievement',
      content: newPostContent,
      timestamp: Date.now(),
      likes: 0
    };

    onPost(post);
    setNewPostContent('');
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return '剛剛';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分鐘前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小時前`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 p-2 rounded-xl">
            <i className="fas fa-users text-emerald-600"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">健康社群</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Share Your Progress</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleCreatePost} className="bg-slate-50 p-4 rounded-3xl space-y-3">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="分享你的心情或食譜..."
          className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-700 placeholder-slate-400 resize-none h-20 outline-none"
        />
        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
          <div className="flex gap-4 text-slate-400 text-sm">
            <button type="button" className="hover:text-emerald-500 transition-colors"><i className="fas fa-camera"></i></button>
            <button type="button" className="hover:text-emerald-500 transition-colors"><i className="fas fa-map-marker-alt"></i></button>
          </div>
          <button
            type="submit"
            disabled={!newPostContent.trim()}
            className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-sm"
          >
            發布貼文
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="border-b border-slate-50 pb-6 last:border-0">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {post.author[0]}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800">{post.author}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{formatTime(post.timestamp)}</span>
                </div>
                
                <p className="text-sm text-slate-600 leading-relaxed">{post.content}</p>
                
                {post.data && (
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white transition-all">
                    <div>
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                        {post.type === 'recipe' ? '推薦食譜' : '達成紀錄'}
                      </h5>
                      <p className="text-sm font-bold text-slate-800">{post.data.foodName}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">{post.data.calories} kcal</span>
                        <span className="text-[10px] text-slate-400 font-medium">蛋:{post.data.protein}g / 碳:{post.data.carbs}g</span>
                      </div>
                    </div>
                    <i className="fas fa-chevron-right text-slate-300 group-hover:text-emerald-500 transition-all"></i>
                  </div>
                )}

                <div className="flex gap-6 pt-2">
                  <button 
                    onClick={() => onLike(post.id)}
                    className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors text-xs font-bold"
                  >
                    <i className={`fas fa-heart ${post.likes > 0 ? 'text-rose-500' : ''}`}></i>
                    {post.likes > 0 ? post.likes : '讚'}
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors text-xs font-bold">
                    <i className="fas fa-comment"></i>
                    留言
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors text-xs font-bold">
                    <i className="fas fa-share-alt"></i>
                    分享
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialCommunity;
