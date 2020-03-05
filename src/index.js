import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import axios from 'axios';
import moment from 'moment';
// import bot from './discord_conn.js';

function Room()
{
	const [isLit, setLit] = React.useState(true)
	const [temp, setTemp] = React.useState(22)

	const brightness = isLit ? "lit" : "dark";
	// const temp_str = temp;
	return (
		<div className = {`room ${brightness}`}>
			<button onClick = {() => setLit(!isLit)}>
				flip
			</button>
			<button onClick = {() => setLit(true)}>
				ON
			</button>
			<button onClick = {() => setLit(false)}>
				OFF
			</button>
			
			<br/>
			
			The room is {isLit ? "lit" : "dark"}, bruh
			<br/>
			<button onClick = {() => setTemp(temp-1)}>
				-
			</button>
			<button onClick = {() => setTemp(temp+1)}>
				+
			</button>
			<br/>
			Temp: {temp}
		</div>
	)
}

function Reddit(props)
{
	const [posts, setPosts] = React.useState([]);

	React.useEffect(() => {
		axios.get(`https://www.reddit.com/r/${props.subreddit_name}.json`)
		.then(res => {
			const newPosts = res.data.data.children.map(obj => obj.data);
			setPosts(newPosts);
		});
	}, []);

	return (
		<div className = "reddit">
			<h1>Ex Nihilo</h1>
			<ul>
				{posts.map (post => (
					<li key={post.id}> 
						<a href={post.url}>
							{post.title}
						</a>: {post.score}, {post.author}
					</li>
				))}
			</ul>			
		</div>
	)
}

const Hello = () =>
{
	return (
		<span>Hello</span>
	);
}

const World = () =>
{
	return (
		<span>World</span>
	);
}

const HelloWorld = () =>
{
	return (
		<div className = 'hello'>
			<Hello/> <World/>
		</div>
	)
}

const SubmitButton = () =>
{
	const buttonLabel = "Submit";
	return (
		<button>{buttonLabel}</button>
	);
}

const ValidIndicator = () =>
{
	const isValid = false;
	return (
		<span>{isValid ? 'valid' : 'not valid'}</span>
	);
}

const MyThing = () =>
{
	return (
		<div className = 'book'>
			<div className = 'title'>
				Cthulhu Mythos
			</div>

			<div className = 'author'>
				H.P. Lovecraft
			</div>
			
			<ul className = 'stats'>
				<li className = 'rating'>
					5 
					Stars
				</li>
				
				<li clasName = 'isbn'>
					12-345678-910
				</li>
			</ul>
		</div>
	);
}

const Table = () =>
{
	return (
		<table>
			<tr>
				<Data/>
			</tr>
		</table>
	);
}

const Data = () =>
{
	return (
		<React.Fragment>
			<th>11</th>
			<th>12</th>
			<th>13</th>
		</React.Fragment>
	);
}

const Tweet = ({ tweet }) =>
{
	return (
		<div className = 'tweet'>
			<Avatar hash = {tweet.gravatar}/>
			
			<div className = 'content'>
				<Author author = {tweet.author}/><Time time = {tweet.timestamp}/>
				<Message text = {tweet.message}/>

				<div className = 'buttons'>
					<ReplyButton/>
					<RetweetButton count = {tweet.retweets}/>
					<LikeButton count = {tweet.likes}/>
					<MoreOptionsButton/>
				</div>
			</div>
		</div>
	);
}

const testTweet = {
	message: "Something about cats", 
	gravatar: "xyz", 
	author: {
		handle: "catperson", 
		name: "IAMA Cat Person"
	}, 
	likes: 2, 
	retweets: 12, 
	timestamp: "2016-07-30 21:24:37"
};

const Avatar = ({ hash }) =>
{
	const url = `https://www.gravatar.com/avatar/${hash}`
	return (
		<img 
			src = {url}
			className = 'avatar'
			alt = "avatar"
		/>
	);
}

const Message = ({ text }) =>
{
	return (
		<div className = 'message'>
			{text}
		</div>
	);
}

const Author = ({ author }) =>
{
	const {name, handle} = author;
	return (
		<span className = 'author'>
			<span className = 'name'>{name}</span>
			<span className = 'handle'>@{handle}</span>
		</span>
	);
}

const Time = ({ time }) => 
{
	const timeString = moment(time).fromNow();
	return (
		<span className = 'time'>{timeString}</span>
	);
}

const ReplyButton = () =>
{
	return (
		<i className = 'fa fa-reply reply-button'/>
	);
}

function getRetweetCount(count)
{
	if (count > 0)
	{
		return (
			<span className = "retweet-count">
				{count}
			</span>
		);
	}
	else
	{
		return null;
	}
}

const RetweetButton = ({ count }) =>
{
	return (
		<span className = "retweet-button">
			<i className = 'fa fa-retweet retweet-button'/>
			{getRetweetCount(count)}
		</span>
	);
}

const LikeButton = ({ count }) => (
	<span className = "like-button">
		<i className = 'fa fa-heart'/>
		{
			count > 0 &&  
			<span className = "like-count">
				{count}
			</span>
		}
	</span>
);

const MoreOptionsButton = () =>
{
	return (
		<i className = 'fa fa-ellipsis-h more-options-button'/>
	);
}

const HelloProps = (props) =>
{
	return (
		<span>Hello {props.name}</span>
	);
}

// const NameCells = () =>
// {
// 	return (
// 		<React.Fragment>
// 			<td>First Name</td>
// 			<td>Last Name</td>
// 		</React.Fragment>
// 	);
// }

// function DiscordServers()
// {
// 	return (
// 		<div className = 'discord-guilds'>
// 			{bot.guilds}
// 		</div>
// 	)
// }

//-----------------------------------

ReactDOM.render (
	<div>
		<HelloWorld/>
		<Room/>
		<Reddit subreddit_name = 'HollowSiren'/>
		<SubmitButton/>
		<ValidIndicator/>
		<MyThing/>
		<Table/>
		<Tweet tweet={testTweet}/>
		<HelloProps name = "Elizabeth"/>
	</div>, 
	document.querySelector('#root')
);