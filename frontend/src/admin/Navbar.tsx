import React from 'react'



const Navbar = () => {
  return (
    <div>
      <nav>
			<i className='bx bx-menu toggle-sidebar' ></i>
			<form action="#">
				
			</form>
		
	
			<span className="divider"></span>
			<div className="profile">
				<img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"/>
				<ul className="profile-link">
					<li><a href="#"><i className='bx bxs-user-circle icon' ></i> Profile</a></li>
					<li><a href="#"><i className='bx bxs-log-out-circle' ></i> Logout</a></li>
				</ul>
			</div>
		</nav>
    </div>
  )
}

export default Navbar