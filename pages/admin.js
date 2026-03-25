import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Admin.module.css';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [promotions, setPromotions] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percent: '',
    discount_amount: '',
    start_date: '',
    end_date: '',
    image_url: ''
  });

  const authenticate = (e) => {
    e.preventDefault();
    // Simple auth - in production use proper JWT
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthenticated(true);
      fetchPromotions();
      fetchMenu();
    } else {
      alert('Invalid password');
    }
  };

  const fetchPromotions = async () => {
    try {
      const res = await fetch('/api/promotions');
      const data = await res.json();
      setPromotions(data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Compress and convert to base64
      compressAndConvert(file);
    }
  };

  const compressAndConvert = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > 1200 || height > 800) {
          const ratio = Math.min(1200 / width, 800 / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.8;
        let base64 = canvas.toDataURL('image/jpeg', quality);

        while (base64.length > 1 * 1024 * 1024 && quality > 0.1) {
          quality -= 0.1;
          base64 = canvas.toDataURL('image/jpeg', quality);
        }

        setFormData(prev => ({ ...prev, image_url: base64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Buffer.from(password).toString('base64')}`
      };

      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({
          title: '',
          description: '',
          discount_percent: '',
          discount_amount: '',
          start_date: '',
          end_date: '',
          image_url: ''
        });
        setShowAddForm(false);
        fetchPromotions();
        alert('Promotion créée!');
      } else {
        alert('Erreur lors de la création');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <>
        <Head>
          <title>Admin - Lucullus</title>
        </Head>
        <div className={styles.loginContainer}>
          <form onSubmit={authenticate} className={styles.loginForm}>
            <h1>Admin Panel</h1>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.btn}>Login</button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin - Lucullus</title>
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Admin Dashboard</h1>
          <button onClick={() => setAuthenticated(false)} className={styles.logoutBtn}>
            Logout
          </button>
        </header>

        <main className={styles.main}>
          <div className={styles.section}>
            <h2>Promotions</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={styles.btn}
            >
              {showAddForm ? 'Cancel' : '+ Add Promotion'}
            </button>

            {showAddForm && (
              <form onSubmit={handleSubmit} className={styles.form}>
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className={styles.input}
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={styles.input}
                />
                <input
                  type="number"
                  placeholder="Discount %"
                  value={formData.discount_percent}
                  onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
                  className={styles.input}
                />
                <input
                  type="number"
                  placeholder="Discount Amount (DT)"
                  value={formData.discount_amount}
                  onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value })}
                  className={styles.input}
                />
                <input
                  type="datetime-local"
                  placeholder="Start Date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className={styles.input}
                />
                <input
                  type="datetime-local"
                  placeholder="End Date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className={styles.input}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.input}
                />
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className={styles.preview} />
                )}
                <button type="submit" disabled={loading} className={styles.btn}>
                  {loading ? 'Saving...' : 'Save Promotion'}
                </button>
              </form>
            )}

            <div className={styles.list}>
              {promotions.map(promo => (
                <div key={promo._id} className={styles.item}>
                  <h3>{promo.title}</h3>
                  <p>{promo.description}</p>
                  {promo.discount_percent && <p>Discount: {promo.discount_percent}%</p>}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
