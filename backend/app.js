const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// 数据库连接配置
const db = mysql.createPool({
<<<<<<< HEAD
    host: '8.138.219.192',
    user: 'testmysql', // 更新为正确的用户名
    password: '5b5dc2099d696f50',
    database: 'testmysql',
=======
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'pet',
>>>>>>> 89a4d49 (upload project files)
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
});

<<<<<<< HEAD

=======
>>>>>>> 89a4d49 (upload project files)
// 测试数据库连接
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ 数据库连接失败:', err.message);
    } else {
        console.log('✅ 数据库连接成功！');
        console.log('📊 连接到数据库: pet');
        console.log('📋 表名: cosmetic_notifications_cancelled');
<<<<<<< HEAD
=======
        
        // 检查表结构
        db.query('DESCRIBE cosmetic_notifications_cancelled', (err, structure) => {
            if (err) {
                console.error('❌ 获取表结构失败:', err);
            } else {
                console.log('📋 cancelled表字段:', structure.map(col => col.Field));
            }
        });
        
        db.query('DESCRIBE cosmetic_notifications', (err, structure) => {
            if (err) {
                console.error('❌ 获取表结构失败:', err);
            } else {
                console.log('📋 notifications表字段:', structure.map(col => col.Field));
            }
        });
        
>>>>>>> 89a4d49 (upload project files)
        connection.release();
    }
});

// 健康检查接口
app.get('/api/health', (req, res) => {
    db.query('SELECT COUNT(*) as total FROM cosmetic_notifications_cancelled', (err, result) => {
        if (err) {
            console.error('数据库查询错误:', err);
            res.status(500).json({
                status: 'error',
                database: 'disconnected',
                error: err.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.json({
                status: 'ok',
                database: 'connected',
                totalRecords: result[0].total,
                timestamp: new Date().toISOString()
            });
        }
    });
});

<<<<<<< HEAD
=======
// 数据诊断接口
app.get('/api/debug/search', (req, res) => {
    const searchTerm = req.query.q || 'La Maison';
    
    console.log(`🔍 Debug search for: "${searchTerm}"`);
    
    // 测试cancelled表
    const cancelledQuery = 'SELECT * FROM cosmetic_notifications_cancelled WHERE product LIKE ? LIMIT 3';
    db.query(cancelledQuery, [`%${searchTerm}%`], (err1, cancelledResults) => {
        if (err1) {
            console.error('❌ Cancelled table error:', err1);
        } else {
            console.log(`📊 Cancelled table: found ${cancelledResults.length} results`);
        }
        
        // 测试notifications表
        const notificationsQuery = 'SELECT * FROM cosmetic_notifications WHERE product LIKE ? LIMIT 3';
        db.query(notificationsQuery, [`%${searchTerm}%`], (err2, notificationsResults) => {
            if (err2) {
                console.error('❌ Notifications table error:', err2);
            } else {
                console.log(`📊 Notifications table: found ${notificationsResults.length} results`);
            }
            
            // 测试表结构
            db.query('DESCRIBE cosmetic_notifications_cancelled', (err3, cancelledStructure) => {
                db.query('DESCRIBE cosmetic_notifications', (err4, notificationsStructure) => {
                    res.json({
                        success: true,
                        searchTerm: searchTerm,
                        results: {
                            cancelled: {
                                count: cancelledResults ? cancelledResults.length : 0,
                                data: cancelledResults || [],
                                error: err1 ? err1.message : null
                            },
                            notifications: {
                                count: notificationsResults ? notificationsResults.length : 0,
                                data: notificationsResults || [],
                                error: err2 ? err2.message : null
                            }
                        },
                        tableStructures: {
                            cancelled: cancelledStructure ? cancelledStructure.map(col => col.Field) : null,
                            notifications: notificationsStructure ? notificationsStructure.map(col => col.Field) : null
                        },
                        timestamp: new Date().toISOString()
                    });
                });
            });
        });
    });
});

>>>>>>> 89a4d49 (upload project files)
// 获取所有被取消的化妆品通知（连接两张表）
app.get('/api/cosmetic_notifications_cancelled', (req, res) => {
    const limit = req.query.limit || 50; // 默认返回50条记录
    const offset = req.query.offset || 0;
    
    const query = `
        SELECT 
            cancelled.notif_no,
            cancelled.product,
            cancelled.holder,
            cancelled.manufacturer,
            cancelled.substance_detected,
            notifications.company,
            notifications.date_notif
        FROM cosmetic_notifications_cancelled cancelled
        LEFT JOIN cosmetic_notifications notifications 
        ON cancelled.notif_no = notifications.notif_no
        LIMIT ${limit} OFFSET ${offset}
    `;
    
    db.query(query, (err, result) => {
        if (err) {
            console.error('数据库查询错误:', err);
            res.status(500).json({
                success: false,
                error: 'Database query failed',
                message: err.message
            });
        } else {
            res.json({
                success: true,
                data: result,
                total: result.length,
                timestamp: new Date().toISOString()
            });
        }
    });
});

<<<<<<< HEAD
// 按产品名称搜索（连接两张表）
=======
// 按产品名称搜索（连接两张表）- 支持部分词匹配
>>>>>>> 89a4d49 (upload project files)
app.get('/api/search/product', (req, res) => {
    const searchTerm = req.query.q;
    
    if (!searchTerm) {
        return res.status(400).json({
            success: false,
            error: 'Search term is required',
            message: 'Please provide a search query parameter "q"'
        });
    }
    
<<<<<<< HEAD
    const query = `
=======
    // 将搜索词分割成多个关键词，支持空格、逗号、连字符分隔
    const keywords = searchTerm.trim()
        .replace(/[,\-_]/g, ' ')  // 将逗号、连字符、下划线替换为空格
        .split(/\s+/)             // 按空格分割
        .filter(word => word.length > 0)  // 过滤空词
        .map(word => word.trim());        // 去除首尾空格
    
    console.log('🔍 Search keywords:', keywords);
    
    if (keywords.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Invalid search term',
            message: 'Please provide valid search keywords'
        });
    }
    
    // 构建动态查询条件 - 每个关键词都要在产品名称、持有者或公司名称中找到
    let whereConditions = [];
    let queryParams = [];
    
    // 为每个关键词创建OR条件（在product, holder, company中任一匹配即可）
    keywords.forEach(keyword => {
        whereConditions.push(`(
            cancelled.product LIKE ? OR 
            cancelled.holder LIKE ? OR 
            cancelled.manufacturer LIKE ? OR
            notifications.company LIKE ?
        )`);
        // 为每个字段添加参数
        const likePattern = `%${keyword}%`;
        queryParams.push(likePattern, likePattern, likePattern, likePattern);
    });
    
    // 使用AND连接所有关键词条件，确保所有关键词都匹配
    const whereClause = whereConditions.join(' AND ');
    
    // 构建notifications表的搜索条件
    let notificationsWhereConditions = [];
    let notificationsParams = [];
    
    keywords.forEach(keyword => {
        notificationsWhereConditions.push(`(
            notifications.product LIKE ? OR 
            notifications.company LIKE ?
        )`);
        const likePattern = `%${keyword}%`;
        notificationsParams.push(likePattern, likePattern);
    });
    
    const notificationsWhereClause = notificationsWhereConditions.join(' AND ');
    
    // 1) 先查 cancelled 表
    const cancelledQuery = `
>>>>>>> 89a4d49 (upload project files)
        SELECT 
            cancelled.notif_no,
            cancelled.product,
            cancelled.holder,
            cancelled.manufacturer,
            cancelled.substance_detected,
            notifications.company,
<<<<<<< HEAD
            notifications.date_notif
        FROM cosmetic_notifications_cancelled cancelled
        LEFT JOIN cosmetic_notifications notifications 
        ON cancelled.notif_no = notifications.notif_no
        WHERE cancelled.product LIKE ? OR cancelled.holder LIKE ? OR notifications.company LIKE ?
        LIMIT 20
    `;
    
    db.query(
        query,
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`],
        (err, result) => {
            if (err) {
                console.error('搜索查询错误:', err);
                res.status(500).json({
                    success: false,
                    error: 'Search query failed',
                    message: err.message
                });
            } else {
                res.json({
                    success: true,
                    data: result,
                    searchTerm: searchTerm,
                    total: result.length,
                    timestamp: new Date().toISOString()
                });
            }
        }
    );
=======
            notifications.date_notif,
            'cancelled' as status
        FROM cosmetic_notifications_cancelled cancelled
        LEFT JOIN cosmetic_notifications notifications 
        ON cancelled.notif_no = notifications.notif_no
        WHERE ${whereClause}
        LIMIT 5
    `;

    // 2) 再查 notifications 表（严格：排除已取消）
    const notificationsQueryStrict = `
        SELECT 
            notifications.notif_no,
            notifications.product,
            NULL as holder,
            NULL as manufacturer,
            NULL as substance_detected,
            notifications.company,
            notifications.date_notif,
            'approved' as status
        FROM cosmetic_notifications notifications
        WHERE notifications.notif_no NOT IN (
            SELECT notif_no FROM cosmetic_notifications_cancelled 
            WHERE notif_no IS NOT NULL
        )
        AND ${notificationsWhereClause}
        LIMIT 5
    `;

    // 3) 如果严格查询无结果，则回退为不排除（尽量给出结果）
    const notificationsQueryRelaxed = `
        SELECT 
            notifications.notif_no,
            notifications.product,
            NULL as holder,
            NULL as manufacturer,
            NULL as substance_detected,
            notifications.company,
            notifications.date_notif,
            'approved' as status
        FROM cosmetic_notifications notifications
        WHERE ${notificationsWhereClause}
        LIMIT 5
    `;

    console.log('🔍 Keywords:', keywords);
    console.log('🔍 Cancelled WHERE:', whereClause);
    console.log('🔍 Notifications WHERE:', notificationsWhereClause);

    console.log('🔍 Cancelled query params:', queryParams);
    console.log('🔍 Notifications query params:', notificationsParams);
    
    db.query(cancelledQuery, queryParams, (err1, cancelledRows) => {
        if (err1) {
            console.error('Cancelled search error:', err1);
            return res.status(500).json({ success: false, error: 'Cancelled search failed', message: err1.message });
        }
        
        console.log(`📊 Cancelled search found: ${cancelledRows.length} results`);

        db.query(notificationsQueryStrict, notificationsParams, (err2, notifRowsStrict) => {
            if (err2) {
                console.error('Notifications search error (strict):', err2);
                // 即使严格报错，也尝试宽松
                db.query(notificationsQueryRelaxed, notificationsParams, (err3, notifRowsRelaxed) => {
                    const combined = [...cancelledRows, ...(notifRowsRelaxed || [])];
                    const dedup = Array.from(new Map(combined.map(r => [r.notif_no, r])).values());
                    const limited = dedup.slice(0, 5);
                    const cancelledCount = limited.filter(r => r.status === 'cancelled').length;
                    const approvedCount = limited.filter(r => r.status === 'approved').length;
                    return res.json({
                        success: true,
                        data: limited,
                        searchTerm,
                        keywords,
                        total: limited.length,
                        breakdown: { cancelled: cancelledCount, approved: approvedCount },
                        mode: 'relaxed-after-error',
                        timestamp: new Date().toISOString()
                    });
                });
                return;
            }

            if (notifRowsStrict && notifRowsStrict.length > 0) {
                const combined = [...cancelledRows, ...notifRowsStrict];
                const dedup = Array.from(new Map(combined.map(r => [r.notif_no, r])).values());
                const limited = dedup.slice(0, 5);
                const cancelledCount = limited.filter(r => r.status === 'cancelled').length;
                const approvedCount = limited.filter(r => r.status === 'approved').length;
                return res.json({
                    success: true,
                    data: limited,
                    searchTerm,
                    keywords,
                    total: limited.length,
                    breakdown: { cancelled: cancelledCount, approved: approvedCount },
                    mode: 'strict',
                    timestamp: new Date().toISOString()
                });
            }

            // 严格无结果 -> 宽松再试
            db.query(notificationsQueryRelaxed, notificationsParams, (err3, notifRowsRelaxed) => {
                if (err3) {
                    console.error('Notifications search error (relaxed):', err3);
                    const limitedCancelled = (cancelledRows || []).slice(0, 5);
                    const cancelledCount = limitedCancelled.filter(r => r.status === 'cancelled').length;
                    const approvedCount = limitedCancelled.filter(r => r.status === 'approved').length;
                    return res.json({
                        success: true,
                        data: limitedCancelled,
                        searchTerm,
                        keywords,
                        total: limitedCancelled.length,
                        breakdown: { cancelled: cancelledCount, approved: approvedCount },
                        mode: 'cancelled-only',
                        timestamp: new Date().toISOString()
                    });
                }

                const combined = [...cancelledRows, ...(notifRowsRelaxed || [])];
                const dedup = Array.from(new Map(combined.map(r => [r.notif_no, r])).values());
                const limited = dedup.slice(0, 5);
                const cancelledCount = limited.filter(r => r.status === 'cancelled').length;
                const approvedCount = limited.filter(r => r.status === 'approved').length;
                return res.json({
                    success: true,
                    data: limited,
                    searchTerm,
                    keywords,
                    total: limited.length,
                    breakdown: { cancelled: cancelledCount, approved: approvedCount },
                    mode: 'relaxed',
                    timestamp: new Date().toISOString()
                });
            });
        });
    });
>>>>>>> 89a4d49 (upload project files)
});

// 按通知号搜索（搜索两张表）
app.get('/api/search/notification', (req, res) => {
    const notifNo = req.query.notif_no;
    
    if (!notifNo) {
        return res.status(400).json({
            success: false,
            error: 'Notification number is required',
            message: 'Please provide notification number parameter "notif_no"'
        });
    }
    
    // 首先搜索cancelled表
    const cancelledQuery = `
        SELECT 
            cancelled.notif_no,
            cancelled.product,
            cancelled.holder,
            cancelled.manufacturer,
            cancelled.substance_detected,
            notifications.company,
            notifications.date_notif,
            'cancelled' as status
        FROM cosmetic_notifications_cancelled cancelled
        LEFT JOIN cosmetic_notifications notifications 
        ON cancelled.notif_no = notifications.notif_no
        WHERE cancelled.notif_no LIKE ?
    `;
    
    // 然后搜索notifications表中不在cancelled表中的产品
    const approvedQuery = `
        SELECT 
            notifications.notif_no,
            notifications.product,
            NULL as holder,
            NULL as manufacturer,
            NULL as substance_detected,
            notifications.company,
            notifications.date_notif,
            'approved' as status
        FROM cosmetic_notifications notifications
        WHERE notifications.notif_no LIKE ? 
        AND notifications.notif_no NOT IN (
            SELECT notif_no FROM cosmetic_notifications_cancelled 
            WHERE notif_no IS NOT NULL
        )
        LIMIT 10
    `;
    
    db.query(cancelledQuery, [`%${notifNo}%`], (err1, cancelledResults) => {
        if (err1) {
            console.error('Cancelled table query error:', err1);
            res.status(500).json({
                success: false,
                error: 'Search failed',
                message: err1.message
            });
            return;
        }
        
        db.query(approvedQuery, [`%${notifNo}%`], (err2, approvedResults) => {
            if (err2) {
                console.error('Approved table query error:', err2);
                // 如果approved查询失败，仍然返回cancelled的结果
                res.json({
                    success: true,
                    data: cancelledResults,
                    notifNo: notifNo,
                    total: cancelledResults.length,
                    timestamp: new Date().toISOString()
                });
                return;
            }
            
            // 合并两个结果
            const combinedResults = [...cancelledResults, ...approvedResults];
            
            res.json({
                success: true,
                data: combinedResults,
                notifNo: notifNo,
                total: combinedResults.length,
                cancelled: cancelledResults.length,
                approved: approvedResults.length,
                timestamp: new Date().toISOString()
            });
        });
    });
});

// 获取所有化妆品通知信息（新表）
app.get('/api/cosmetic_notifications', (req, res) => {
    const limit = req.query.limit || 50;
    const offset = req.query.offset || 0;
    
    db.query(
        `SELECT * FROM cosmetic_notifications LIMIT ${limit} OFFSET ${offset}`, 
        (err, result) => {
            if (err) {
                console.error('数据库查询错误:', err);
                res.status(500).json({
                    success: false,
                    error: 'Database query failed',
                    message: err.message
                });
            } else {
                res.json({
                    success: true,
                    data: result,
                    total: result.length,
                    timestamp: new Date().toISOString()
                });
            }
        }
    );
});

<<<<<<< HEAD
=======
// 获取低风险产品（从notifications表中排除cancelled表的产品）
app.get('/api/low-risk-products', (req, res) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    
    const query = `
        SELECT 
            notifications.notif_no,
            notifications.product,
            notifications.company,
            notifications.date_notif,
            'approved' as status
        FROM cosmetic_notifications notifications
        WHERE notifications.notif_no NOT IN (
            SELECT notif_no FROM cosmetic_notifications_cancelled 
            WHERE notif_no IS NOT NULL
        )
        ORDER BY notifications.date_notif DESC
        LIMIT ${limit} OFFSET ${offset}
    `;
    
    console.log(`🔍 Getting low risk products: limit=${limit}, offset=${offset}`);
    
    db.query(query, (err, result) => {
        if (err) {
            console.error('低风险产品查询错误:', err);
            res.status(500).json({
                success: false,
                error: 'Low risk products query failed',
                message: err.message
            });
        } else {
            console.log(`✅ Found ${result.length} low risk products`);
            res.json({
                success: true,
                data: result,
                total: result.length,
                limit: limit,
                offset: offset,
                timestamp: new Date().toISOString()
            });
        }
    });
});

>>>>>>> 89a4d49 (upload project files)
// 测试两表连接查询
app.get('/api/test/join', (req, res) => {
    const query = `
        SELECT 
            cancelled.notif_no,
            cancelled.product,
            cancelled.holder,
            cancelled.manufacturer,
            cancelled.substance_detected,
            notifications.company,
            notifications.date_notif,
            CASE 
                WHEN notifications.notif_no IS NOT NULL THEN 'Found in both tables'
                ELSE 'Only in cancelled table'
            END as join_status
        FROM cosmetic_notifications_cancelled cancelled
        LEFT JOIN cosmetic_notifications notifications 
        ON cancelled.notif_no = notifications.notif_no
        LIMIT 10
    `;
    
    db.query(query, (err, result) => {
        if (err) {
            console.error('连接查询错误:', err);
            res.status(500).json({
                success: false,
                error: 'Join query failed',
                message: err.message
            });
        } else {
            res.json({
                success: true,
                data: result,
                message: 'Join test completed',
                timestamp: new Date().toISOString()
            });
        }
    });
});

<<<<<<< HEAD
=======
// 测试notifications表搜索
app.get('/api/test/notifications-search', (req, res) => {
    const searchTerm = req.query.q || 'Daisy';
    
    const query = `
        SELECT 
            notifications.notif_no,
            notifications.product,
            notifications.company,
            notifications.date_notif
        FROM cosmetic_notifications notifications
        WHERE notifications.notif_no NOT IN (
            SELECT notif_no FROM cosmetic_notifications_cancelled 
            WHERE notif_no IS NOT NULL
        )
        AND (notifications.product LIKE ? OR notifications.company LIKE ?)
        LIMIT 10
    `;
    
    const params = [`%${searchTerm}%`, `%${searchTerm}%`];
    
    console.log('🧪 Testing notifications table search for:', searchTerm);
    console.log('🧪 Query:', query);
    console.log('🧪 Parameters:', params);
    
    db.query(query, params, (err, result) => {
        if (err) {
            console.error('Notifications search test error:', err);
            res.status(500).json({
                success: false,
                error: 'Notifications search test failed',
                message: err.message
            });
        } else {
            console.log(`🧪 Notifications search test: found ${result.length} results`);
            res.json({
                success: true,
                data: result,
                searchTerm: searchTerm,
                total: result.length,
                message: 'Notifications search test completed',
                timestamp: new Date().toISOString()
            });
        }
    });
});

>>>>>>> 89a4d49 (upload project files)
// 获取筛选统计信息（只返回数量，不返回具体数据）
app.get('/api/filter/statistics', (req, res) => {
    const queries = [
        // 总体统计
        `SELECT 
            COUNT(*) as total_notifications,
            'all_notifications' as category
         FROM cosmetic_notifications`,
        
        `SELECT 
            COUNT(*) as total_cancelled,
            'cancelled_products' as category
         FROM cosmetic_notifications_cancelled`,
        
        // 风险等级统计
        `SELECT 
            COUNT(*) as high_risk_count,
            'high_risk' as category
         FROM cosmetic_notifications_cancelled 
         WHERE substance_detected IS NOT NULL 
         AND (UPPER(substance_detected) LIKE '%MERCURY%' 
              OR UPPER(substance_detected) LIKE '%LEAD%' 
              OR UPPER(substance_detected) LIKE '%ARSENIC%' 
              OR UPPER(substance_detected) LIKE '%CADMIUM%')`,
        
        `SELECT 
            COUNT(*) as medium_risk_count,
            'medium_risk' as category
         FROM cosmetic_notifications_cancelled 
         WHERE substance_detected IS NOT NULL 
         AND (UPPER(substance_detected) LIKE '%HYDROQUINONE%' 
              OR UPPER(substance_detected) LIKE '%PARABENS%' 
              OR UPPER(substance_detected) LIKE '%FORMALDEHYDE%')`,
        
        // 成分统计
        `SELECT 
            COUNT(*) as mercury_free_count,
            'mercury_free' as category
         FROM cosmetic_notifications n
         WHERE n.notif_no NOT IN (
             SELECT c.notif_no FROM cosmetic_notifications_cancelled c 
             WHERE c.notif_no IS NOT NULL 
             AND UPPER(c.substance_detected) LIKE '%MERCURY%'
         )`,
        
        `SELECT 
            COUNT(*) as contains_harmful_count,
            'contains_harmful' as category
         FROM cosmetic_notifications_cancelled 
         WHERE substance_detected IS NOT NULL AND substance_detected != ''`
    ];
    
    const statistics = {};
    let completedQueries = 0;
    
    queries.forEach((query, index) => {
        db.query(query, (err, result) => {
            if (err) {
                console.error(`Statistics query ${index} error:`, err);
            } else if (result && result.length > 0) {
                const category = result[0].category;
                const count = Object.values(result[0])[0]; // 获取第一个数值字段
                statistics[category] = count;
            }
            
            completedQueries++;
            
            if (completedQueries === queries.length) {
                // 计算安全产品数量
                const totalNotifications = statistics.all_notifications || 0;
                const totalCancelled = statistics.cancelled_products || 0;
                const approvedCount = totalNotifications - totalCancelled;
                
                res.json({
                    success: true,
                    statistics: {
                        total_products: totalNotifications,
                        approved_products: approvedCount,
                        cancelled_products: totalCancelled,
                        low_risk: approvedCount, // 假设未取消的产品为低风险
                        medium_risk: statistics.medium_risk_count || 0,
                        high_risk: statistics.high_risk_count || 0,
                        mercury_free: statistics.mercury_free_count || 0,
                        contains_harmful: statistics.contains_harmful_count || 0
                    },
                    timestamp: new Date().toISOString()
                });
            }
        });
    });
});

// 获取制造商统计信息（用于趋势页面饼图）
app.get('/api/manufacturer/statistics', (req, res) => {
    const query = `
        SELECT 
            manufacturer,
            COUNT(*) as violation_count,
            GROUP_CONCAT(DISTINCT substance_detected) as harmful_substances
        FROM cosmetic_notifications_cancelled 
        WHERE manufacturer IS NOT NULL AND manufacturer != ''
        GROUP BY manufacturer
        ORDER BY violation_count DESC
        LIMIT 20
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Manufacturer statistics query error:', err);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch manufacturer statistics',
                message: err.message
            });
            return;
        }

        // 计算总违规数和制造商数量
        const totalViolations = results.reduce((sum, item) => sum + item.violation_count, 0);
        const totalManufacturers = results.length;

        // 为饼图准备数据
        const chartData = results.map((item, index) => ({
            manufacturer: item.manufacturer,
            violations: item.violation_count,
            percentage: ((item.violation_count / totalViolations) * 100).toFixed(1),
            harmful_substances: item.harmful_substances ? item.harmful_substances.split(',') : [],
            color: generateColor(index)
        }));

        res.json({
            success: true,
            data: {
                manufacturers: chartData,
                summary: {
                    total_violations: totalViolations,
                    total_manufacturers: totalManufacturers,
                    top_violator: results[0] ? results[0].manufacturer : 'N/A',
                    most_violations: results[0] ? results[0].violation_count : 0
                }
            },
            timestamp: new Date().toISOString()
        });
    });
});

// 生成饼图颜色的辅助函数
function generateColor(index) {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
        '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D2B4DE',
        '#A3E4D7', '#F9E79F', '#D5A6BD', '#AED6F1', '#A9DFBF'
    ];
    return colors[index % colors.length];
}

// 根路径
app.get('/', (req, res) => {
    res.json({
        message: 'Product Safety API Server',
        status: 'running',
        endpoints: {
            health: '/api/health',
            cancelledData: '/api/cosmetic_notifications_cancelled',
            notificationsData: '/api/cosmetic_notifications',
            searchProduct: '/api/search/product?q=DELUXE',
            searchNotification: '/api/search/notification?notif_no=NOT200603276K',
            filterStatistics: '/api/filter/statistics',
            manufacturerStatistics: '/api/manufacturer/statistics',
            testJoin: '/api/test/join'
        },
        timestamp: new Date().toISOString()
    });
});

// 启动服务器
<<<<<<< HEAD
app.listen(8000, '0.0.0.0', () => {
    console.log('');
    console.log('🚀 ===== 服务器启动成功 =====');
    console.log('📡 服务器地址: http://8.138.219.192:8000');
    console.log('🏥 健康检查: http://8.138.219.192:8000/api/health');
    console.log('📊 获取取消数据: http://8.138.219.192:8000/api/cosmetic_notifications_cancelled');
    console.log('📋 获取通知数据: http://8.138.219.192:8000/api/cosmetic_notifications');
    console.log('🔍 搜索产品: http://8.138.219.192:8000/api/search/product?q=DELUXE');
    console.log('🔢 搜索通知号: http://8.138.219.192:8000/api/search/notification?notif_no=NOT200603276K');
    console.log('📈 筛选统计: http://8.138.219.192:8000/api/filter/statistics');
    console.log('📊 制造商统计: http://8.138.219.192:8000/api/manufacturer/statistics');
    console.log('🔗 测试表连接: http://8.138.219.192:8000/api/test/join');
=======
app.listen(8000, () => {
    console.log('');
    console.log('🚀 ===== 服务器启动成功 =====');
    console.log('📡 服务器地址: http://localhost:8000');
    console.log('🏥 健康检查: http://localhost:8000/api/health');
    console.log('📊 获取取消数据: http://localhost:8000/api/cosmetic_notifications_cancelled');
    console.log('📋 获取通知数据: http://localhost:8000/api/cosmetic_notifications');
    console.log('✅ 获取低风险产品: http://localhost:8000/api/low-risk-products?limit=10');
    console.log('🔍 搜索产品: http://localhost:8000/api/search/product?q=DELUXE');
    console.log('🔢 搜索通知号: http://localhost:8000/api/search/notification?notif_no=NOT200603276K');
    console.log('📈 筛选统计: http://localhost:8000/api/filter/statistics');
    console.log('📊 制造商统计: http://localhost:8000/api/manufacturer/statistics');
    console.log('🔗 测试表连接: http://localhost:8000/api/test/join');
    console.log('🐛 搜索调试: http://localhost:8000/api/debug/search?q=La%20Maison');
    console.log('🧪 Notifications测试: http://localhost:8000/api/test/notifications-search?q=Daisy');
>>>>>>> 89a4d49 (upload project files)
    console.log('===============================');
});