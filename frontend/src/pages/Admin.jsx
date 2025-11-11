    import React from 'react'
    
    function Admin() {
      return (
        <div>
          
            <div style={{  marginTop: '2rem' , marginBottom: '2rem' ,backgroundColor: '#e0e7ff',color: '#3730a3',width: 'fit-content',padding: '1rem 2rem',borderRadius: '0.5rem',boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', height: 'fit-content', marginLeft: '1rem'}}>
                <h1>
                    <>
                        <span style={{fontSize: '1.5rem', fontWeight: 700}}>Admin Dashboard</span>
                        <small style={{display: 'block', fontSize: '0.85rem', color: '#6b7280'}}>Overview & management</small>
                    </>
                </h1>
                {/* Additional admin functionalities can be added here */}
                <h1 >
                    <span style={{fontSize: '1rem', fontWeight: 700,}}>main Admin Section </span> 
                    {/* Add more details or components here change userprofile pass username or email */}
                    </h1>
                    
                <h1 >
                    <span style={{fontSize: '1rem', fontWeight: 700,}}>Sales</span>
                    {/* Add sales related components or details here */} 
                    </h1>
                    
                <h1 >
                    <span style={{fontSize: '1rem', fontWeight: 700,}}>Users
                        {/* Add user management components or details here */}
                        </span> 
                    </h1>
                    
                
            </div>
            

       
       
        </div>
      )
    }
    
    export default Admin
    