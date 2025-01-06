import React from 'react'
import { Link } from 'react-router-dom';

export default function ProfileAnalytics({ postData, tempUser, id, jobData, session, connectedUser, others }) {
    return (
        <div className="profile-card card">
            <div className="analytics-title section-title">
                <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Analytics</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '15px' }}>visibility</span>
                    <div style={{ fontSize: '12px' }}>Private for you</div>
                </div>
            </div>
            <div className="analytics-stats">
                <div>
                    <div>
                        <span className="material-symbols-rounded">description</span>
                    </div>
                    <div style={{ fontSize: '20px', textDecoration: 'none' }}>
                        <Link to={`/posts-filter-results/${id}`} className="linkStyle">{postData?.data?.length} Posts</Link>
                        <div style={{ fontSize: '12px' }}>Discover your post.</div>
                    </div>
                </div>
                {tempUser?.data.role === "alumni" && <div>
                    <div>
                        <span className="material-symbols-rounded">bar_chart</span>
                    </div>
                    <div style={{ fontSize: '20px', textDecoration: 'none' }}>
                        <Link to={others ? '#' : `/userJob/${id}`} className="linkStyle">{jobData?.data?.length} Referrals posted</Link>
                        <div style={{ fontSize: '12px' }}>Checkout the referrals posted by you.</div>
                    </div>
                </div>}
                <div>
                    <div>
                        <span className="material-symbols-rounded">group</span>
                    </div>
                    <div style={{ fontSize: '20px', textDecoration: 'none' }}>
                        <Link to={session?.user !== id ? '#' : '/network'} className="linkStyle">{typeof connectedUser?.data === "string" ? 0 : connectedUser?.data?.length} connections</Link>
                        <div style={{ fontSize: '12px' }}>See Your connections.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
